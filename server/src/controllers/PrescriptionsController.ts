import { Request, Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService';
import { ok } from '../utils/response';
import { PrescriptionRepository } from '../repositories/PrescriptionRepositories';

export class PrescriptionsController {
  private service = new PrescriptionService();
  private repo = new PrescriptionRepository();

  create = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.createPrescription(dto);
    res.json(ok(data));
  };

  list = async (req: Request, res: Response) => {
    const { doctorId, patientId, from, to } = req.query as any;
    let rows = await this.repo.find({ order: { createdAt: 'DESC' } as any });
    if (doctorId) rows = rows.filter(p => (p as any).doctorId === String(doctorId));
    if (patientId) rows = rows.filter(p => (p as any).patientId === String(patientId));
    if (from) rows = rows.filter(p => (p as any).createdAt >= new Date(String(from)));
    if (to) rows = rows.filter(p => (p as any).createdAt <= new Date(String(to)));
    res.json(ok(rows));
  };
}
