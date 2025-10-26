import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { ok } from '../utils/response';

export class PatientsController {
  private service = new PatientService();

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
}
