import { StaffRepository, LeaveRepository, StaffTimingRepository } from '../repositories/StaffRepositories';
import { StaffAllotmentRepository, StaffAllotmentRequestRepository } from '../repositories/AllotmentRepositories';
import { StrategyRegistry } from '../patterns/strategies';

export class StaffAllotmentService {
  private staffRepo = new StaffRepository();
  private leaveRepo = new LeaveRepository();
  private timingRepo = new StaffTimingRepository();
  private allotRepo = new StaffAllotmentRepository();
  private requestRepo = new StaffAllotmentRequestRepository();
  private chooser = StrategyRegistry.staffAllotment as any; // choose by staffId order

  async request(roomId: number, role: string, minutes: number) {
    const req = this.requestRepo.create({ roomId, role, totalMinutes: minutes, remainingMinutes: minutes, active: true } as any);
    const saved = await this.requestRepo.save(req as any);
    await this.allocateNextForRequest(saved.id);
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

  private async remainingTodayMinutes(staffId: string, at: Date) {
    // Find a timing block that includes 'at'
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][at.getUTCDay()];
    const timings = await this.timingRepo.find({ where: { staffId } as any });
    const block = timings.find(t => t.day === day && t.isAvailable);
    if (!block) return 0;
    // parse HH:MM in UTC; for simplicity assume server in UTC
    const [eh, em] = String(block.endTime).split(':').map(Number);
    const end = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate(), eh || 0, em || 0, 0));
    const diffMs = end.getTime() - at.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  }

  async allocateNextForRequest(requestId: string) {
    const req = await this.requestRepo.findById(requestId);
    if (!req || !req.active || req.remainingMinutes <= 0) return null;
    const now = new Date();
    // guard: if one active assignment exists, do nothing
    const active = await this.getCurrentlyActiveAssignmentForRequest(requestId);
    if (active) return null;

    // gather candidate staff by role
    const staff = await this.staffRepo.find({ where: { role: req.role } as any });
    // filter available now
    const candidateIds: string[] = [];
    for (const s of staff) {
      const onLeave = await this.isOnLeave(s.id, now);
      const busy = await this.isBusy(s.id, now);
      const remaining = await this.remainingTodayMinutes(s.id, now);
      if (!onLeave && !busy && remaining > 0) {
        candidateIds.push(s.id);
      }
    }
    if (candidateIds.length === 0) return null;

    const chosenId = this.chooser.allot(candidateIds) as string | null;
    if (!chosenId) return null;
    const remainingToday = await this.remainingTodayMinutes(chosenId, now);
    const duration = Math.min(req.remainingMinutes, remainingToday);
    if (duration <= 0) return null;

    const endAt = new Date(now.getTime() + duration * 60000);
    const allot = this.allotRepo.create({
      staffId: chosenId,
      roomId: req.roomId,
      role: req.role,
      requestId: req.id,
      startAt: now,
      endAt,
    } as any);
    await this.allotRepo.save(allot as any);

    req.remainingMinutes = Math.max(0, req.remainingMinutes - duration);
    req.updatedAt = new Date();
    if (req.remainingMinutes === 0) req.active = false;
    await this.requestRepo.save(req as any);
    return allot;
  }

  async processPendingRequests() {
    const reqs = await this.requestRepo.find({ where: { active: true } as any });
    for (const r of reqs) {
      if (r.remainingMinutes > 0) {
        await this.allocateNextForRequest(r.id);
      }
    }
  }

  async listAssignmentsForStaff(staffId: string) {
    return this.allotRepo.find({ where: { staffId } as any, order: { startAt: 'DESC' } as any });
  }

  async listAssignmentsForRoom(roomId: number) {
    return this.allotRepo.find({ where: { roomId } as any, order: { startAt: 'DESC' } as any });
  }
}
