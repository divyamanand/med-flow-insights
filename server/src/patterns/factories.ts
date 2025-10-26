// Factories encapsulate creation logic to keep services decoupled from concrete classes

import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';
import { Staff } from '../entities/Staff';
import { Doctor } from '../entities/Doctor';
import { InventoryItem, InventoryKind } from '../entities/InventoryItem';

export interface IRoomFactory {
  createRoom(roomNumber: number, roomName: string, type: RoomType): Room;
}

export class RoomFactory implements IRoomFactory {
  createRoom(roomNumber: number, roomName: string, type: RoomType): Room {
    const r = new Room();
    r.roomNumber = roomNumber;
    r.roomName = roomName;
    r.type = type;
    r.typeId = type.id;
    r.status = 'vacant';
    return r;
  }
}

export interface IStaffFactory {
  createStaff(input: Omit<Staff, 'id' | 'timings' | 'leaves' | 'doctor'> & { passwordHash: string }): Staff;
}

export class StaffFactory implements IStaffFactory {
  createStaff(input: any): Staff {
    const s = new Staff();
    Object.assign(s, input);
    return s;
  }
}

export interface IDoctorFactory {
  createDoctor(staff: Staff): Doctor;
}

export class DoctorFactory implements IDoctorFactory {
  createDoctor(staff: Staff): Doctor {
    const d = new Doctor();
    d.staff = staff;
    d.staffId = staff.id;
    return d;
  }
}

export interface IInventoryItemFactory {
  createItem(kind: InventoryKind, props: { name?: string; manufacturer?: string; bloodGroup?: string }): InventoryItem;
}

export class InventoryItemFactory implements IInventoryItemFactory {
  createItem(kind: InventoryKind, props: { name?: string; manufacturer?: string; bloodGroup?: string }): InventoryItem {
    const i = new InventoryItem();
    i.kind = kind;
    i.name = props.name ?? null;
    i.manufacturer = props.manufacturer ?? null;
    i.bloodGroup = props.bloodGroup ?? null;
    return i;
  }
}

// Factory Registry to centralize creation policies and allow runtime swapping
export class FactoryRegistry {
  private static _room: IRoomFactory = new RoomFactory();
  private static _staff: IStaffFactory = new StaffFactory();
  private static _doctor: IDoctorFactory = new DoctorFactory();
  private static _inventory: IInventoryItemFactory = new InventoryItemFactory();

  static get room() { return this._room; }
  static set room(v: IRoomFactory) { this._room = v; }

  static get staff() { return this._staff; }
  static set staff(v: IStaffFactory) { this._staff = v; }

  static get doctor() { return this._doctor; }
  static set doctor(v: IDoctorFactory) { this._doctor = v; }

  static get inventory() { return this._inventory; }
  static set inventory(v: IInventoryItemFactory) { this._inventory = v; }
}
