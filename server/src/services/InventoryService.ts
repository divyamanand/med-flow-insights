import { InventoryItemRepository, InventoryStockRepository } from '../repositories/InventoryRepositories';
import { FactoryRegistry, IInventoryItemFactory } from '../patterns/factories';
import { ISellingStrategy, StrategyRegistry } from '../patterns/strategies';

export class InventoryService {
  private itemRepo = new InventoryItemRepository();
  private stockRepo = new InventoryStockRepository();
  private factory: IInventoryItemFactory = FactoryRegistry.inventory;
  private selling: ISellingStrategy = StrategyRegistry.inventorySelling;

  async addItem(input: { kind: 'medicine' | 'blood' | 'equipment'; name?: string; manufacturer?: string; bloodGroup?: string; quantity: number; }) {
    const item = this.factory.createItem(input.kind, { name: input.name, manufacturer: input.manufacturer, bloodGroup: input.bloodGroup });
    const saved = await this.itemRepo.save(item as any);
    const stock = this.stockRepo.create({ itemId: saved.id, quantity: input.quantity } as any);
    await this.stockRepo.save(stock as any);
    return saved;
  }

  async sell(itemIdOrName: string, qty: number) {
    // first check by id, then by name
    let item = await this.itemRepo.findById(itemIdOrName);
    if (!item) {
      item = await this.itemRepo.findByName(itemIdOrName as any);
    }
    if (!item) throw new Error('Item not found');
    const ok = await this.selling.sell(item.id, qty, this.stockRepo);
    if (!ok) throw new Error('Insufficient stock');
    return { itemId: item.id, sold: qty };
  }
}
