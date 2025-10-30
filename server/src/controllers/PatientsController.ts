import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { ok } from '../utils/response';
import { StaffAllotmentService } from '../services/StaffAllotmentService';
import { AppointmentService } from '../services/AppointmentService';
import { RoomStaffRequirementRepository } from '../repositories/RoomRepositories';

export class PatientsController {
  private service = new PatientService();
  private staffAllot = new StaffAllotmentService();
  private roomReqRepo = new RoomStaffRequirementRepository();
  private apptService = new AppointmentService();

  create = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.createPatient(dto);
    res.json(ok(data));
  };

  addIssue = async (req: Request, res: Response) => {
    const { patientId, issue } = (req as any).dto as any;
    const data = await this.service.addIssue(patientId, issue);
    res.json(ok(data));
  };

  admit = async (req: Request, res: Response) => {
    const { patientId, roomId } = (req as any).dto as any;
    const data = await this.service.admit(patientId, Number(roomId));
    res.json(ok(data));
  };

  discharge = async (req: Request, res: Response) => {
    const { patientId } = (req as any).dto as any;
    const data = await this.service.discharge(patientId);
    res.json(ok(data));
  };

  // Admit and immediately create staff allotment requests based on room requirements
  admitWithStaff = async (req: Request, res: Response) => {
    const { patientId, roomId, minutes } = (req as any).dto as { patientId: string; roomId: number; minutes?: number };
    const admission = await this.service.admit(patientId, Number(roomId));
    const reqs = await this.roomReqRepo.find({ where: { roomId: Number(roomId) } as any });
    const duration = minutes && minutes > 0 ? minutes : 60;
    for (const r of reqs as any[]) {
      await this.staffAllot.request(Number(roomId), r.role, duration);
    }
    res.json(ok({ admission, staffRequests: reqs.length }));
  };

  // Full flow: admit, create appointment (auto-select doctor via issues), and request staff
  admitFull = async (req: Request, res: Response) => {
    const { patientId, roomId, issues, apptDuration, staffMinutes } = (req as any).dto as any;
    const admission = await this.service.admit(patientId, Number(roomId));
    let appointment: any = null;
    if (issues && Array.isArray(issues) && issues.length) {
      appointment = await this.apptService.createAppointmentForAnyDoctor(patientId, new Date(), issues, apptDuration);
    }
    const reqs = await this.roomReqRepo.find({ where: { roomId: Number(roomId) } as any });
    const duration = staffMinutes && staffMinutes > 0 ? staffMinutes : 60;
    for (const r of reqs as any[]) {
      await this.staffAllot.request(Number(roomId), r.role, duration);
    }
    res.json(ok({ admission, appointment, staffRequests: reqs.length }));
  };
}
