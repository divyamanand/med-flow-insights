import { Room } from '../entities/Room';
import { Doctor } from '../entities/Doctor';
import { InventoryItem } from '../entities/InventoryItem';
import { InventoryStockRepository } from '../repositories/InventoryRepositories';

// Room allocation strategy
export interface IRoomAllocationStrategy {
  allocateRoom(rooms: Room[], requiredTypeId: number): Room | null;
}

export class SimpleFirstAvailableAllocation implements IRoomAllocationStrategy {
  allocateRoom(rooms: Room[], requiredTypeId: number): Room | null {
    const r = rooms.find((r) => r.typeId === requiredTypeId && (r.status === 'vacant' || r.status === 'cleaning'));
    return r || null;
  }
}

// Staff allotment strategy (round-robin by index)
export interface IStaffAllotmentStrategy<T> {
  allot(list: T[], key?: any): T | null;
}

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
  chooseDoctor(candidates: Doctor[], speciality?: string): Doctor | null;
}

export class SimpleDoctorAppointmentStrategy implements IDoctorAppointmentStrategy {
  chooseDoctor(candidates: Doctor[], speciality?: string): Doctor | null {
    if (!candidates.length) return null;
    if (speciality) {
      const matched = candidates.find((d) => (d.specialities || []).some((s) => s.speciality === speciality));
      if (matched) return matched;
    }
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
