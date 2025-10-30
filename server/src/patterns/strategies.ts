import { Room } from '../entities/Room';
import { Doctor } from '../entities/Doctor';
import { InventoryItem } from '../entities/InventoryItem';
import { InventoryStockRepository } from '../repositories/InventoryRepositories';

// Room allocation strategy
export interface IRoomAllocationStrategy {
  allocateRoom(rooms: Room[], requiredType: string): Room | null;
}

// Accepts required type NAME and picks first available matching room
export class SimpleFirstAvailableAllocation implements IRoomAllocationStrategy {
  allocateRoom(rooms: Room[], requiredType: string): Room | null {
    const req = (requiredType || '').toLowerCase();
    const r = rooms.find((r) =>
      (!!r.type && (r.type.name || '').toLowerCase() === req) &&
      (r.status === 'vacant' || r.status === 'cleaning')
    );
    return r || null;
  }
}

// Staff allotment strategy (round-robin by index)
export interface IStaffAllotmentStrategy<T> {
  allot(list: T[], key?: any): T | null;
}

//in case of doctor room. we need to take care of whether the doctor is available or not
//only then the staff is required so make a strategy for it too.

export class RoundRobinAllotment<T> implements IStaffAllotmentStrategy<T> {
  private idx = 0;
  allot(list: T[], _key?: any): T | null {
    if (!list.length) return null;
    const pick = list[this.idx % list.length];
    this.idx += 1;
    return pick;
  }
}

// Doctor selection strategy
export interface IDoctorAppointmentStrategy {
  chooseDoctor(candidates: Doctor[], specialities?: string[]): Doctor | null;
}

export class SimpleDoctorAppointmentStrategy implements IDoctorAppointmentStrategy {
  // choose doctor with the highest count of matching specialities; fall back to first
  chooseDoctor(candidates: Doctor[], specialities?: string[]): Doctor | null {
    if (!candidates.length) return null;
    const req = (specialities || []).map((s) => s.toLowerCase());
    if (!req.length) return candidates[0] || null;

    let best: { doc: Doctor; score: number } | null = null;
    for (const d of candidates) {
      const specs = (d.specialities || []).map((s: any) => {
        const n = s?.speciality?.name ?? s?.speciality ?? '';
        return String(n).toLowerCase();
      });
      const set = new Set(specs);
      let score = 0;
      for (const r of req) if (set.has(r)) score += 1;
      if (!best || score > best.score) best = { doc: d, score };
    }
    if (best && best.score > 0) return best.doc;
    return candidates[0] || null;
  }
}

// Inventory selling strategy (FIFO by stock.createdAt asc)
export interface ISellingStrategy {
  sell(itemId: string, qty: number, stockRepo: InventoryStockRepository): Promise<boolean>;
}

export class FIFOInventorySelling implements ISellingStrategy {
  async sell(itemId: string, qty: number, stockRepo: InventoryStockRepository): Promise<boolean> {
    let remaining = qty;
    const stocks = await stockRepo.find({ where: { itemId } as any, order: { createdAt: 'ASC' } as any });
    for (const s of stocks) {
      if (remaining <= 0) break;
      if (s.quantity <= remaining) {
        remaining -= s.quantity;
        await stockRepo.remove(s as any);
      } else {
        s.quantity -= remaining;
        remaining = 0;
        await stockRepo.save(s as any);
      }
    }
    return remaining <= 0;
  }
}

// Strategy Registry to centralize decision-making algorithms and allow runtime swapping
export class StrategyRegistry {
  private static _roomAllocation: IRoomAllocationStrategy = new SimpleFirstAvailableAllocation();
  private static _staffAllotment: IStaffAllotmentStrategy<any> = new RoundRobinAllotment<any>();
  private static _doctorAppointment: IDoctorAppointmentStrategy = new SimpleDoctorAppointmentStrategy();
  private static _inventorySelling: ISellingStrategy = new FIFOInventorySelling();

  static get roomAllocation() { return this._roomAllocation; }
  static set roomAllocation(v: IRoomAllocationStrategy) { this._roomAllocation = v; }

  static get staffAllotment() { return this._staffAllotment; }
  static set staffAllotment(v: IStaffAllotmentStrategy<any>) { this._staffAllotment = v; }

  static get doctorAppointment() { return this._doctorAppointment; }
  static set doctorAppointment(v: IDoctorAppointmentStrategy) { this._doctorAppointment = v; }

  static get inventorySelling() { return this._inventorySelling; }
  static set inventorySelling(v: ISellingStrategy) { this._inventorySelling = v; }
}
