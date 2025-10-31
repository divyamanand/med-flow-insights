import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { ok } from '../utils/response';
import { InventoryItemRepository, InventoryStockRepository, EquipmentAllotmentRepository } from '../repositories/InventoryRepositories';
import { EquipmentRequirementRepository } from '../repositories/RoomRepositories';

export class InventoryController {
  private service = new InventoryService();
  private itemRepo = new InventoryItemRepository();
  private stockRepo = new InventoryStockRepository();
  private equipAllotRepo = new EquipmentAllotmentRepository();
  private equipReqRepo = new EquipmentRequirementRepository();

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

  // GET endpoints
  listItems = async (req: Request, res: Response) => {
    const { kind, name } = req.query as any;
    let rows = await this.itemRepo.find();
    if (kind) rows = rows.filter(x => (x as any).kind === String(kind));
    if (name) rows = rows.filter(x => (x as any).name?.toLowerCase().includes(String(name).toLowerCase()));
    res.json(ok(rows));
  };

  getItem = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const item = await this.itemRepo.findById(String(id));
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(ok(item));
  };

  stocks = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const rows = await this.stockRepo.find({ where: { itemId: String(id) } as any, order: { createdAt: 'DESC' } as any });
    res.json(ok(rows));
  };

  equipmentRequirements = async (req: Request, res: Response) => {
    const { roomId } = req.query as any;
    const where = roomId ? { roomId: Number(roomId) } : {};
    const rows = await this.equipReqRepo.find({ where: where as any });
    res.json(ok(rows));
  };

  activeEquipmentAllotments = async (req: Request, res: Response) => {
    const { roomId, itemName } = req.query as any;
    const now = new Date();
    let rows = await this.equipAllotRepo.find();
    if (roomId) rows = rows.filter(a => (a as any).roomId === Number(roomId));
    if (itemName) rows = rows.filter(a => (a as any).item?.name === String(itemName) || (a as any).itemName === String(itemName));
    rows = rows.filter(a => (a as any).startAt <= now && (a as any).endAt > now);
    res.json(ok(rows));
  };

  availability = async (req: Request, res: Response) => {
    const { itemName } = req.query as any;
    if (!itemName) return res.status(400).json({ error: 'itemName is required' });
    const available = await (this.service as any).getAvailableUnitsByName(itemName);
    res.json(ok({ itemName, available }));
  };
}
