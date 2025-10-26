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
}
