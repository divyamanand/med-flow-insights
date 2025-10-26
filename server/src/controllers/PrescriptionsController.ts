import { Request, Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService';
import { ok } from '../utils/response';

export class PrescriptionsController {
  private service = new PrescriptionService();

  create = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.createPrescription(dto);
    res.json(ok(data));
  };
}
