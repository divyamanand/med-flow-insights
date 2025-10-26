import { BaseRepository } from './BaseRepository';
import { InventoryItem } from '../entities/InventoryItem';
import { InventoryStock } from '../entities/InventoryStock';

export class InventoryItemRepository extends BaseRepository<InventoryItem> {
  constructor() { super(InventoryItem); }
  findByName(name: string) { return this.findOne({ where: { name } as any }); }
}

export class InventoryStockRepository extends BaseRepository<InventoryStock> {
  constructor() { super(InventoryStock); }
}
