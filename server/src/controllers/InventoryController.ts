import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { ok } from '../utils/response';

export class InventoryController {
  private service = new InventoryService();

  addItem = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.addItem(dto);
    res.json(ok(data));
  };

  sell = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.sell(dto.itemIdOrName, dto.quantity);
    res.json(ok(data));
  };

  addStock = async (req: Request, res: Response) => {
    const dto = (req as any).dto as any;
    const data = await this.service.addStock(dto.itemIdOrName, dto.quantity);
    res.json(ok(data));
  };

  allotEquipment = async (req: Request, res: Response) => {
    const { itemName, roomId, quantity, minutes } = (req as any).dto as any;
    const data = await this.service.allotEquipmentToRoom(itemName, Number(roomId), quantity, minutes);
    res.json(ok(data));
  };

  releaseEquipment = async (req: Request, res: Response) => {
    const { itemName, roomId } = (req as any).dto as any;
    const data = await this.service.releaseEquipmentFromRoom(itemName, Number(roomId));
    res.json(ok(data));
  };

  processEquipmentRequirements = async (_req: Request, res: Response) => {
    await this.service.processRoomEquipmentRequirements();
    res.json(ok({ status: 'processed' }));
  };

  requestEquipment = async (req: Request, res: Response) => {
    const { roomId, equipmentType, quantity, minutes } = (req as any).dto as any;
    const data = await this.service.requestEquipment(Number(roomId), equipmentType, quantity, minutes);
    res.json(ok(data));
  };
}
