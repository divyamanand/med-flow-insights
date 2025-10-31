import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { ok } from '../utils/response';
import { AppointmentRepository } from '../repositories/AppointmentRepositories';

export class AppointmentsController {
  private service = new AppointmentService();
  private repo = new AppointmentRepository();

  create = async (req: Request, res: Response) => {
    const { patientId, timestamp, speciality, doctorId, duration } = (req as any).dto as { patientId: string; timestamp: string; speciality?: string; doctorId?: string; duration?: number };
    const data = await this.service.createAppointment(patientId, new Date(timestamp), speciality, doctorId, duration);
    res.json(ok(data));
  };

  list = async (req: Request, res: Response) => {
    const { doctorId, patientId, from, to } = req.query as any;
    let rows = await this.repo.find({ order: { timestamp: 'DESC' } as any });
    if (doctorId) rows = rows.filter(a => (a as any).doctorId === String(doctorId));
    if (patientId) rows = rows.filter(a => (a as any).patientId === String(patientId));
    if (from) rows = rows.filter(a => a.timestamp >= new Date(String(from)));
    if (to) rows = rows.filter(a => a.timestamp <= new Date(String(to)));
    res.json(ok(rows));
  };
}
