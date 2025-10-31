import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { ok } from '../utils/response';
import { RoomRepository } from '../repositories/RoomRepositories';
import { StaffAllotmentRepository } from '../repositories/AllotmentRepositories';
import { EquipmentAllotmentRepository } from '../repositories/InventoryRepositories';
import { AdmissionRepository } from '../repositories/PatientRepositories';

export class RoomsController {
  private service = new RoomService();
  private roomRepo = new RoomRepository();
  private staffAllotRepo = new StaffAllotmentRepository();
  private equipAllotRepo = new EquipmentAllotmentRepository();
  private admissionRepo = new AdmissionRepository();

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

  allocateToEmployee = async (req: Request, res: Response) => {
    const { userId, requiredRoomType } = (req as any).dto as { userId: string; requiredRoomType: string };
    const data = await this.service.allocateToEmployee(userId, requiredRoomType);
    res.json(ok(data));
  };

  // Backward-compatible alias for routers expecting ctrl.allocate
  allocate = this.allocateToEmployee;

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

  vacate = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const data = await this.service.vacate(Number(id));
    res.json(ok(data));
  };

  // GET endpoints
  statusSummary = async (_req: Request, res: Response) => {
    const rooms = await this.roomRepo.list();
    const summary = rooms.reduce((acc: any, r: any) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    res.json(ok(summary));
  };

  allocationsStaff = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const now = new Date();
    const rows = (await this.staffAllotRepo.find({ where: { roomId: Number(id) } as any }))
      .filter(a => a.startAt <= now && a.endAt > now);
    res.json(ok(rows));
  };

  allocationsEquipment = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const now = new Date();
    const rows = (await this.equipAllotRepo.find({ where: { roomId: Number(id) } as any }))
      .filter(a => a.startAt <= now && a.endAt > now);
    res.json(ok(rows));
  };

  occupancy = async (_req: Request, res: Response) => {
    const rows = await this.admissionRepo.find({ where: { dischargedAt: null } as any });
    res.json(ok(rows));
  };
}
