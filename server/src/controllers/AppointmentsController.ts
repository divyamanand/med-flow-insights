import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { ok } from '../utils/response';

export class AppointmentsController {
  private service = new AppointmentService();

  create = async (req: Request, res: Response) => {
    const { patientId, timestamp, speciality } = (req as any).dto as { patientId: string; timestamp: string; speciality?: string };
    const data = await this.service.createAppointment(patientId, new Date(timestamp), speciality);
    res.json(ok(data));
  };
}
