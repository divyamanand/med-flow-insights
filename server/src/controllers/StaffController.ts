import { Request, Response } from 'express';
import { StaffService } from '../services/StaffService';
import { ok } from '../utils/response';
import { StaffRepository, DoctorRepository, StaffTimingRepository, LeaveRepository } from '../repositories/StaffRepositories';
import { AppointmentRepository } from '../repositories/AppointmentRepositories';

export class StaffController {
  private service = new StaffService();
  private staffRepo = new StaffRepository();
  private doctorRepo = new DoctorRepository();
  private timingRepo = new StaffTimingRepository();
  private leaveRepo = new LeaveRepository();
  private apptRepo = new AppointmentRepository();

  createStaff = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.createStaff(dto);
    res.json(ok(data));
  };

  createDoctor = async (req: Request, res: Response) => {
    const { staffId, specialities } = (req as any).dto as { staffId: string; specialities?: string[] };
    const data = await this.service.createDoctor(staffId, specialities);
    res.json(ok(data));
  };

  addTiming = async (req: Request, res: Response) => {
    const { staffId, day, startTime, endTime } = (req as any).dto as any;
    const data = await this.service.addTiming(staffId, day, startTime, endTime);
    res.json(ok(data));
  };

  requestLeave = async (req: Request, res: Response) => {
    const { staffId, startDate, endDate } = (req as any).dto as any;
    const data = await this.service.requestLeave(staffId, startDate, endDate);
    res.json(ok(data));
  };

  listDoctors = async (_req: Request, res: Response) => {
    const data = await this.service.listDoctors();
    res.json(ok(data));
  };

  // GET endpoints for staff and doctors
  list = async (req: Request, res: Response) => {
    const { role } = req.query as any;
    const data = role ? await this.staffRepo.find({ where: { role: String(role) } as any }) : await this.staffRepo.find();
    res.json(ok(data));
  };

  getStaff = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const s = await this.staffRepo.findById(String(id));
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(ok(s));
  };

  getDoctor = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const d = await this.doctorRepo.findById(String(id));
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(ok(d));
  };

  timings = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.timingRepo.find({ where: { staffId: String(id) } as any });
    res.json(ok(rows));
  };

  leaves = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.leaveRepo.find({ where: { staffId: String(id) } as any, order: { startDate: 'DESC' } as any });
    res.json(ok(rows));
  };

  doctorAppointments = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const { date, from, to } = req.query as any;
    let rows = await this.apptRepo.find({ where: { doctorId: String(id) } as any, order: { timestamp: 'ASC' } as any });
    if (date) {
      const d = new Date(String(date));
      rows = rows.filter(a => a.timestamp.toDateString() === d.toDateString());
    }
    if (from) rows = rows.filter(a => a.timestamp >= new Date(String(from)));
    if (to) rows = rows.filter(a => a.timestamp <= new Date(String(to)));
    res.json(ok(rows));
  };
}
