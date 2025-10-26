import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { ok } from '../utils/response';

export class RoomsController {
  private service = new RoomService();

  createType = async (req: Request, res: Response) => {
    const { name } = (req as any).dto as { name: string };
    const data = await this.service.createRoomType(name);
    res.json(ok(data));
  };

  create = async (req: Request, res: Response) => {
    const { roomNumber, roomName, typeId } = (req as any).dto as { roomNumber: number; roomName: string; typeId: number };
    const data = await this.service.createRoom(roomNumber, roomName, typeId);
    res.json(ok(data));
  };

  list = async (_req: Request, res: Response) => {
    const data = await this.service.listRooms();
    res.json(ok(data));
  };

  allocate = async (req: Request, res: Response) => {
    const { userId, requiredTypeId } = (req as any).dto as { userId: string; requiredTypeId: number };
    const data = await this.service.allocate(userId, requiredTypeId);
    res.json(ok(data));
  };

  changeStatus = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const { status } = (req as any).dto as { status: any };
    const data = await this.service.changeStatus(Number(id), status);
    res.json(ok(data));
  };

  addStaffRequirement = async (req: Request, res: Response) => {
    const { roomId, role, count } = (req as any).dto as any;
    const data = await this.service.addStaffRequirement(Number(roomId), role, Number(count));
    res.json(ok(data));
  };

  addEquipmentRequirement = async (req: Request, res: Response) => {
    const { roomId, equipmentType, count } = (req as any).dto as any;
    const data = await this.service.addEquipmentRequirement(Number(roomId), equipmentType, Number(count));
    res.json(ok(data));
  };
}
