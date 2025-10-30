import { Request, Response } from 'express';
import { StaffService } from '../services/StaffService';
import { ok } from '../utils/response';

export class StaffController {
  private service = new StaffService();

  listStaff = async (_req: Request, res: Response) => {
    const data = await this.service.listStaff();
    res.json(ok(data));
  };

  getStaffById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.service.getStaffById(id);
    res.json(ok(data));
  };

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
}
