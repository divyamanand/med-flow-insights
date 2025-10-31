import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { ok } from '../utils/response';
import { StaffAllotmentService } from '../services/StaffAllotmentService';
import { AppointmentService } from '../services/AppointmentService';
import { RoomStaffRequirementRepository } from '../repositories/RoomRepositories';
import { PatientRepository, PatientIssueRepository, AdmissionRepository } from '../repositories/PatientRepositories';
import { AppointmentRepository } from '../repositories/AppointmentRepositories';
import { PrescriptionRepository } from '../repositories/PrescriptionRepositories';

export class PatientsController {
  private service = new PatientService();
  private staffAllot = new StaffAllotmentService();
  private roomReqRepo = new RoomStaffRequirementRepository();
  private apptService = new AppointmentService();
  private patientRepo = new PatientRepository();
  private issueRepo = new PatientIssueRepository();
  private admissionRepo = new AdmissionRepository();
  private apptRepo = new AppointmentRepository();
  private prescriptionRepo = new PrescriptionRepository();

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

  // GET endpoints
  list = async (req: Request, res: Response) => {
    const data = await this.patientRepo.find();
    res.json(ok(data));
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const p = await this.patientRepo.findById(String(id));
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(ok(p));
  };

  issues = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.issueRepo.find({ where: { patientId: String(id) } as any, order: { createdAt: 'DESC' } as any });
    res.json(ok(rows));
  };

  appointments = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const { from, to, upcoming } = req.query as any;
    let rows = await this.apptRepo.find({ where: { patientId: String(id) } as any, order: { timestamp: 'DESC' } as any });
    const now = new Date();
    if (from) rows = rows.filter(a => a.timestamp >= new Date(String(from)));
    if (to) rows = rows.filter(a => a.timestamp <= new Date(String(to)));
    if (upcoming) rows = rows.filter(a => a.timestamp >= now);
    res.json(ok(rows));
  };

  currentAdmission = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const a = await this.admissionRepo.findOne({ where: { patientId: String(id), dischargedAt: null } as any, order: { admittedAt: 'DESC' } as any });
    res.json(ok(a));
  };

  admissions = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.admissionRepo.find({ where: { patientId: String(id) } as any, order: { admittedAt: 'DESC' } as any });
    res.json(ok(rows));
  };

  prescriptions = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.prescriptionRepo.find({ where: { patientId: String(id) } as any, order: { createdAt: 'DESC' } as any });
    res.json(ok(rows));
  };
}
