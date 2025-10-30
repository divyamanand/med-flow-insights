import { Request, Response } from 'express';
import { ok } from '../utils/response';
import { StaffAllotmentService } from '../services/StaffAllotmentService';
import { ReleaseStaffAllotmentDto } from '../dto/allotment.dto';

export class StaffAllotmentController {
  private service = new StaffAllotmentService();

  request = async (req: Request, res: Response) => {
    const { roomId, role, minutes } = (req as any).dto as { roomId: number; role: string; minutes: number };
    const data = await this.service.request(roomId, role, minutes);
    res.json(ok(data));
  };

  listStaff = async (req: Request, res: Response) => {
    const { staffId } = req.query as any;
    const data = await this.service.listAssignmentsForStaff(String(staffId));
    res.json(ok(data));
  };

  listRoom = async (req: Request, res: Response) => {
    const { roomId } = req.query as any;
    const data = await this.service.listAssignmentsForRoom(Number(roomId));
    res.json(ok(data));
  };

  release = async (req: Request, res: Response) => {
    const { staffId, roomId } = (req as any).dto as ReleaseStaffAllotmentDto;
    const data = await this.service.releaseStaff(staffId, roomId);
    res.json(ok(data));
  };

  processPending = async (_req: Request, res: Response) => {
    await this.service.processPendingRequests();
    res.json(ok({ status: 'processed' }));
  };

  processRoomRequirements = async (_req: Request, res: Response) => {
    await this.service.processRoomStaffRequirements();
    res.json(ok({ status: 'processed' }));
  };
}
