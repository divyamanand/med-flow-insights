import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { ok } from '../utils/response';

export class AppointmentsController {
  private service = new AppointmentService();

  list = async (_req: Request, res: Response) => {
    const data = await this.service.listAppointments();
    res.json(ok(data));
  };

  create = async (req: Request, res: Response) => {
    const { patientId, timestamp, speciality, doctorId, duration } = (req as any).dto as { patientId: string; timestamp: string; speciality?: string; doctorId?: string; duration?: number };
    const data = await this.service.createAppointment(patientId, new Date(timestamp), speciality, doctorId, duration);
    res.json(ok(data));
  };
}
