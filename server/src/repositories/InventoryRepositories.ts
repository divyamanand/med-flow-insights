import { BaseRepository } from './BaseRepository';
import { InventoryItem } from '../entities/InventoryItem';
import { InventoryStock } from '../entities/InventoryStock';
import { EquipmentAllotment } from '../entities/EquipmentAllotment';

export class InventoryItemRepository extends BaseRepository<InventoryItem> {
  constructor() { super(InventoryItem); }
  findByName(name: string) { return this.findOne({ where: { name } as any }); }
}

export class InventoryStockRepository extends BaseRepository<InventoryStock> {
  constructor() { super(InventoryStock); }
}

export class EquipmentAllotmentRepository extends BaseRepository<EquipmentAllotment> {
  constructor() { super(EquipmentAllotment); }
}
