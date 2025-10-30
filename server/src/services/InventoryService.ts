import { EquipmentAllotmentRepository, InventoryItemRepository, InventoryStockRepository } from '../repositories/InventoryRepositories';
import { FactoryRegistry, IInventoryItemFactory } from '../patterns/factories';
import { ISellingStrategy, StrategyRegistry } from '../patterns/strategies';
import { EquipmentRequirementRepository } from '../repositories/RoomRepositories';

export class InventoryService {
  private itemRepo = new InventoryItemRepository();
  private stockRepo = new InventoryStockRepository();
  private equipAllotRepo = new EquipmentAllotmentRepository();
  private roomEquipReqRepo = new EquipmentRequirementRepository();
  private factory: IInventoryItemFactory = FactoryRegistry.inventory;
  private selling: ISellingStrategy = StrategyRegistry.inventorySelling;

  async listItems() {
    return this.itemRepo.find();
  }

  async addItem(input: { kind: 'medicine' | 'blood' | 'equipment'; name?: string; manufacturer?: string; bloodGroup?: string; quantity: number; }) {
    const item = this.factory.createItem(input.kind, { name: input.name, manufacturer: input.manufacturer, bloodGroup: input.bloodGroup });
    const saved = await this.itemRepo.save(item as any);
    const stock = this.stockRepo.create({ itemId: saved.id, quantity: input.quantity } as any);
    await this.stockRepo.save(stock as any);
    return saved;
  }

  async sell(itemIdOrName: string, qty: number) {
    let item = await this.itemRepo.findById(itemIdOrName);
    if (!item) {
      item = await this.itemRepo.findByName(itemIdOrName as any);
    }
    if (!item) throw new Error('Item not found');
    const ok = await this.selling.sell(item.id, qty, this.stockRepo);
    if (!ok) throw new Error('Insufficient stock');
    return { itemId: item.id, sold: qty };
  }

  async addStock(itemIdOrName: string, quantity: number) {
    if (!quantity || quantity <= 0) throw new Error('Quantity must be positive');
    let item = await this.itemRepo.findById(itemIdOrName);
    if (!item) {
      item = await this.itemRepo.findByName(itemIdOrName as any);
    }
    if (!item) throw new Error('Item not found');
    const stock = this.stockRepo.create({ itemId: item.id, quantity } as any);
    const saved = await this.stockRepo.save(stock as any);
    return { itemId: item.id, added: quantity, stockId: (saved as any).id };
  }

  // Equipment allotment: helper to compute available units considering active allotments
  // Accepts itemName to avoid requiring callers to know IDs
  private async getAvailableUnitsByName(itemName: string) {
    const item = await this.itemRepo.findOne({ where: { name: itemName, kind: 'equipment' } as any });
    if (!item) return 0;
    const stocks = await this.stockRepo.find({ where: { itemId: item.id } as any });
    const total = stocks.reduce((s, x) => s + (x.quantity || 0), 0);
    const now = new Date();
    const activeAllots = await this.equipAllotRepo.find({ where: { itemId: item.id } as any });
    const activeQty = activeAllots.filter(a => a.startAt <= now && a.endAt > now).reduce((s, a: any) => s + (a.quantity || 0), 0);
    return Math.max(0, total - activeQty);
  }

  // Allocate equipment to a room for a certain duration (minutes)
  async allotEquipmentToRoom(itemName: string, roomId: number, quantity = 1, minutes = 60) {
    // find item by name for kind 'equipment'
    const item = await this.itemRepo.findOne({ where: { name: itemName, kind: 'equipment' } as any });
    if (!item) throw new Error('Equipment item not found');
    const available = await this.getAvailableUnitsByName(itemName);
    if (available < quantity) throw new Error('Insufficient equipment available');
    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + minutes * 60_000);
    const alloc = this.equipAllotRepo.create({ itemId: item.id, roomId, quantity, startAt, endAt } as any);
    return this.equipAllotRepo.save(alloc as any);
  }

  // Release equipment from a room immediately (ends all active allocations for that item/room)
  async releaseEquipmentFromRoom(itemName: string, roomId: number) {
    const item = await this.itemRepo.findOne({ where: { name: itemName, kind: 'equipment' } as any });
    if (!item) throw new Error('Equipment item not found');
    const now = new Date();
    const allots = await this.equipAllotRepo.find({ where: { itemId: item.id, roomId } as any });
    const actives = allots.filter(a => a.startAt <= now && a.endAt > now);
    for (const a of actives as any[]) {
      a.endAt = now;
      await this.equipAllotRepo.save(a as any);
    }
    return { released: actives.length };
  }

  // Process permanent room equipment requirements to ensure target counts are met
  async processRoomEquipmentRequirements(defaultMinutes = 8 * 60) {
    const reqs = await this.roomEquipReqRepo.find({ where: { allotmentType: 'permanent' } as any });
    const now = new Date();
    for (const r of reqs as any[]) {
      // requirement is by equipmentType name
      const item = await this.itemRepo.findOne({ where: { name: r.equipmentType, kind: 'equipment' } as any });
      if (!item) continue;
      const allots = await this.equipAllotRepo.find({ where: { itemId: item.id, roomId: r.roomId } as any });
      const activeCount = allots.filter(a => a.startAt <= now && a.endAt > now).reduce((s, a: any) => s + (a.quantity || 0), 0);
      const needed = Math.max(0, ((r.count as any) || 0) - activeCount);
      if (needed <= 0) continue;
      const available = await this.getAvailableUnitsByName(r.equipmentType);
      const toAlloc = Math.min(needed, available);
      if (toAlloc <= 0) continue;
      const startAt = now;
      const endAt = new Date(now.getTime() + defaultMinutes * 60_000);
      const alloc = this.equipAllotRepo.create({ itemId: item.id, roomId: r.roomId, quantity: toAlloc, startAt, endAt } as any);
      await this.equipAllotRepo.save(alloc as any);
    }
  }

  // Create a temporary equipment requirement and process allocations for it
  async requestEquipment(roomId: number, equipmentType: string, quantity = 1, minutes = 60) {
    const req = this.roomEquipReqRepo.create({ roomId, equipmentType, allotmentType: 'temporary', count: quantity, totalMinutes: minutes } as any);
    const saved = await this.roomEquipReqRepo.save(req as any);
    await this.processTemporaryEquipmentRequests();
    return saved;
  }

  // Allocate equipment for temporary requirements if not currently satisfied
  async processTemporaryEquipmentRequests() {
    const now = new Date();
    const reqs = await this.roomEquipReqRepo.find({ where: { allotmentType: 'temporary' } as any });
    for (const r of reqs as any[]) {
      const item = await this.itemRepo.findOne({ where: { name: r.equipmentType, kind: 'equipment' } as any });
      if (!item) continue;
      const allots = await this.equipAllotRepo.find({ where: { itemId: item.id, roomId: r.roomId } as any });
      const activeQty = allots.filter(a => a.startAt <= now && a.endAt > now).reduce((s, a: any) => s + (a.quantity || 0), 0);
      const need = Math.max(0, ((r.count as any) || 0) - activeQty);
      if (need <= 0) continue;
      const available = await this.getAvailableUnitsByName(r.equipmentType);
      const toAlloc = Math.min(need, available);
      if (toAlloc <= 0) continue;
      const startAt = now;
      const duration = (r.totalMinutes as any) || 60;
      const endAt = new Date(startAt.getTime() + duration * 60_000);
      const alloc = this.equipAllotRepo.create({ itemId: item.id, roomId: r.roomId, quantity: toAlloc, startAt, endAt } as any);
      await this.equipAllotRepo.save(alloc as any);
      (r as any).updatedAt = new Date();
      await this.roomEquipReqRepo.save(r as any);
    }
  }
}
