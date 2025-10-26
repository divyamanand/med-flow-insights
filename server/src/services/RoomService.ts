import { RoomRepository, RoomTypeRepository, RoomEquipmentRequirementRepository, RoomStaffRequirementRepository } from '../repositories/RoomRepositories';
import { FactoryRegistry, IRoomFactory } from '../patterns/factories';
import { IRoomAllocationStrategy } from '../patterns/strategies';
import { StrategyRegistry } from '../patterns/strategies';
import { Room } from '../entities/Room';

export class RoomService {
  private roomRepo = new RoomRepository();
  private typeRepo = new RoomTypeRepository();
  private staffReqRepo = new RoomStaffRequirementRepository();
  private equipReqRepo = new RoomEquipmentRequirementRepository();

  constructor(
    private factory: IRoomFactory = FactoryRegistry.room,
    private allocator: IRoomAllocationStrategy = StrategyRegistry.roomAllocation,
  ) {}

  async createRoomType(name: string) {
    const existing = await this.typeRepo.findByName(name);
    if (existing) return existing;
    const t = this.typeRepo.create({ name });
    return this.typeRepo.save(t as any);
  }

  async createRoom(roomNumber: number, roomName: string, typeId: number) {
    const rtype = await this.typeRepo.findById(typeId);
    if (!rtype) throw new Error('RoomType not found');
    const room = this.factory.createRoom(roomNumber, roomName, rtype);
    return this.roomRepo.save(room as any);
  }

  listRooms() { return this.roomRepo.list(); }

  async changeStatus(roomId: number, status: Room['status']) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    room.status = status;
    return this.roomRepo.save(room as any);
  }

  async allocate(userId: string, requiredTypeId: number) {
  const rooms = await this.roomRepo.find();
  const r = this.allocator.allocateRoom(rooms, requiredTypeId);
    if (!r) return null;
    r.status = 'occupied';
    await this.roomRepo.save(r as any);
    return { roomId: r.id, userId, time: new Date() };
  }

  async addStaffRequirement(roomId: number, role: string, count: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    const rec = this.staffReqRepo.create({ roomId: room.id, room: room as any, role, count } as any);
    return this.staffReqRepo.save(rec as any);
  }

  async addEquipmentRequirement(roomId: number, equipmentType: string, count: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    const rec = this.equipReqRepo.create({ roomId: room.id, room: room as any, equipmentType, count } as any);
    return this.equipReqRepo.save(rec as any);
  }
}
