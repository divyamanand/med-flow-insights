import { StaffRepository, LeaveRepository, StaffTimingRepository } from '../repositories/StaffRepositories';
import { StaffAllotmentRepository, StaffAllotmentRequestRepository } from '../repositories/AllotmentRepositories';
import { } from '../repositories/RoomRepositories';
import { StrategyRegistry } from '../patterns/strategies';

export class StaffAllotmentService {
  private timingRepo = new StaffTimingRepository()
  private staffRepo = new StaffRepository()
  private leaveRepo = new LeaveRepository();
  private allotRepo = new StaffAllotmentRepository();
  private requestRepo = new StaffAllotmentRequestRepository();
  private chooser = StrategyRegistry.staffAllotment as any; // choose by staffId order
  // Using unified staff requirement (StaffAllotmentRequest) for both temp and permanent

  async request(roomId: number, role: string, minutes: number) {
    const req = this.requestRepo.create({ roomId, role, allotmentType: 'temporary', totalMinutes: minutes, count: null } as any);
    const saved = await this.requestRepo.save(req as any);
    await this.processPendingRequests()
    return saved;
  }

  private async getCurrentlyActiveAssignmentForRequest(requestId: string) {
    const now = new Date();
    const assigns = await this.allotRepo.find({ where: { requestId } as any });
    return assigns.find(a => a.startAt <= now && a.endAt > now);
  }

  private async isOnLeave(staffId: string, at: Date) {
    const leaves = await this.leaveRepo.find({ where: { staffId } as any });
    return leaves.some(l => l.startDate <= at && l.endDate >= at);
  }

  private async isBusy(staffId: string, at: Date) {
    const assigns = await this.allotRepo.find({ where: { staffId } as any });
    return assigns.some(a => a.startAt <= at && a.endAt > at);
  }

  private async isAvailable(staffId: string, at: Date) {
    // check staff weekly timings against the provided timestamp
    // A staff is available if any timing block for the day contains the time
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayMap[at.getDay()];

    const timings = await this.timingRepo.find({ where: { staffId, day } as any });
    if (!timings.length) return false;

    const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();
    const nowMins = minutesOf(at);

    const toMinutes = (hhmm: string) => {
      const [hh, mm] = hhmm.split(':').map((n) => parseInt(n, 10));
      return (hh || 0) * 60 + (mm || 0);
    };

    return timings.some((t: any) => {
      const start = toMinutes(t.startTime);
      const end = toMinutes(t.endTime);
      if (Number.isNaN(start) || Number.isNaN(end)) return false;
      if (end === start) return false; // zero-length window treated as unavailable
      if (end > start) {
        // same-day window
        return nowMins >= start && nowMins < end;
      }
      // overnight window (e.g., 22:00-06:00)
      return nowMins >= start || nowMins < end;
    });
  }

  private async getShiftEnd(staffId: string, at: Date): Promise<Date | null> {
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayMap[at.getDay()];
    const timings = await this.timingRepo.find({ where: { staffId, day } as any });
    if (!timings.length) return null;
    const toMinutes = (hhmm: string) => {
      const [hh, mm] = hhmm.split(':').map((n) => parseInt(n, 10));
      return (hh || 0) * 60 + (mm || 0);
    };
    const nowMins = at.getHours() * 60 + at.getMinutes();
    for (const t of timings as any[]) {
      const start = toMinutes(t.startTime);
      const end = toMinutes(t.endTime);
      if (Number.isNaN(start) || Number.isNaN(end) || end === start) continue;
      if (end > start) {
        if (nowMins >= start && nowMins < end) {
          const endAt = new Date(at);
          endAt.setHours(Math.floor(end / 60), end % 60, 0, 0);
          return endAt;
        }
      } else {
        // overnight: e.g., 22:00-06:00
        if (nowMins >= start || nowMins < end) {
          const endAt = new Date(at);
          if (nowMins >= start) endAt.setDate(endAt.getDate() + 1);
          endAt.setHours(Math.floor(end / 60), end % 60, 0, 0);
          return endAt;
        }
      }
    }
    return null;
  }

  async processPendingRequests() {
    // fetch all requests (entity doesn't model active/remaining flags yet)
    const reqs = await this.requestRepo.find({ where: { allotmentType: 'temporary' } as any });
    const now = new Date();
    for (const r of reqs) {
      // If there's already an active assignment for this request, skip for now
      const current = await this.getCurrentlyActiveAssignmentForRequest(r.id);
      if (current) continue;

      const allAvail = await this.listAvailableAndFreeStaff();
      const candidates = allAvail.filter((s: any) => (s.role || '').toLowerCase() === (r.role || '').toLowerCase());
      if (!candidates.length) continue;

      const chosen: any = this.chooser?.allot ? this.chooser.allot(candidates, r) : candidates[0];
      if (!chosen) continue;

      const startAt = now;
      const endAt = new Date(startAt.getTime() + (r.totalMinutes || 0) * 60_000);

      const allot = this.allotRepo.create({
        staffId: chosen.id,
        roomId: r.roomId,
        role: r.role,
        requestId: r.id,
        startAt,
        endAt,
      } as any);
      await this.allotRepo.save(allot as any);

      (r as any).updatedAt = new Date();
      await this.requestRepo.save(r as any);
    }
  }

  // Handle permanent room staff requirements (RoomStaffRequirementRepository)
  // Ensure at any given time we have at least `count` active assignments for each room/role
  async processRoomStaffRequirements() {
    // Ensure at any given time we have at least `count` active assignments for each room/role
    const reqs = await this.requestRepo.find({ where: { allotmentType: 'permanent' } as any });
    const now = new Date();
    for (const r of reqs as any[]) {
      const existing = await this.allotRepo.find({ where: { roomId: r.roomId, role: r.role } as any });
      const active = existing.filter(a => a.startAt <= now && a.endAt > now);
      const needed = Math.max(0, ((r.count as any) || 0) - active.length);
      if (needed <= 0) continue;

      // Find candidates and allocate up to `needed`
      const allAvail = await this.listAvailableAndFreeStaff();
      let candidates = allAvail.filter((s: any) => (s.role || '').toLowerCase() === (r.role || '').toLowerCase());
      for (let i = 0; i < needed; i++) {
        if (!candidates.length) break;
        const chosen: any = this.chooser?.allot ? this.chooser.allot(candidates, r) : candidates[0];
        if (!chosen) break;
        // compute end at shift end, else default 60 minutes
        const endAt = await this.getShiftEnd(chosen.id, now) || new Date(now.getTime() + 60 * 60 * 1000);
        const allot = this.allotRepo.create({
          staffId: chosen.id,
          roomId: r.roomId,
          role: r.role,
          requestId: null,
          startAt: now,
          endAt,
        } as any);
        await this.allotRepo.save(allot as any);
        // remove chosen from candidates to avoid duplicate allocation this cycle
        candidates = candidates.filter((c: any) => c.id !== chosen.id);
      }
    }
  }

  async listAvailableAndFreeStaff() {
    const now = new Date();
    const staffList = await this.staffRepo.find();
    const result = [] as any[];
    for (const s of staffList as any[]) {
      const [onLeave, busy, available] = await Promise.all([
        this.isOnLeave(s.id, now),
        this.isBusy(s.id, now),
        this.isAvailable(s.id, now),
      ]);
      if (!onLeave && !busy && available) result.push(s);
    }
    return result as any;
  }

  async listAssignmentsForStaff(staffId: string) {
    return this.allotRepo.find({ where: { staffId } as any, order: { startAt: 'DESC' } as any });
  }

  async listAssignmentsForRoom(roomId: number) {
    return this.allotRepo.find({ where: { roomId } as any, order: { startAt: 'DESC' } as any });
  }

  // Release a staff member from active assignment(s) immediately.
  // If roomId is provided, only release assignments for that room; otherwise release all active ones for the staff.
  async releaseStaff(staffId: string, roomId?: number) {
    const now = new Date();
    const where: any = { staffId };
    const assigns = await this.allotRepo.find({ where });
    const actives = assigns.filter(a => a.startAt <= now && a.endAt > now && (roomId ? a.roomId === roomId : true));
    for (const a of actives as any[]) {
      a.endAt = now;
      await this.allotRepo.save(a as any);
    }
    return { released: actives.length };
  }
}
