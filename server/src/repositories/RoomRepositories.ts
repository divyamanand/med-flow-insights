import { BaseRepository } from './BaseRepository';
import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';
import { RoomStaffRequirement } from '../entities/RoomStaffRequirement';
import { RoomEquipmentRequirement } from '../entities/RoomEquipmentRequirement';
import { EquipmentRequirement } from '../entities/EquipmentRequirement';
import { EmployeeRoomAllocation } from '../entities/EmployeeRoomAllocation';

export class RoomTypeRepository extends BaseRepository<RoomType> {
  constructor() { super(RoomType); }
  findByName(name: string) { return this.findOne({ where: { name } }); }
}

export class RoomRepository extends BaseRepository<Room> {
  constructor() { super(Room); }
  list() { return this.find({ order: { roomNumber: 'ASC' } as any }); }
}

export class RoomStaffRequirementRepository extends BaseRepository<RoomStaffRequirement> {
  constructor() { super(RoomStaffRequirement); }
}

export class RoomEquipmentRequirementRepository extends BaseRepository<RoomEquipmentRequirement> {
  constructor() { super(RoomEquipmentRequirement); }
}

export class EmployeeRoomAllocationRepository extends BaseRepository<EmployeeRoomAllocation> {
  constructor() { super(EmployeeRoomAllocation); }
}

export class EquipmentRequirementRepository extends BaseRepository<EquipmentRequirement> {
  constructor() { super(EquipmentRequirement); }
}
