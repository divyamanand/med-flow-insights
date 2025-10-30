import { RoomRepository, RoomTypeRepository, EmployeeRoomAllocationRepository } from '../repositories/RoomRepositories';
import { StaffAllotmentRequestRepository } from '../repositories/AllotmentRepositories';
import { EquipmentRequirementRepository } from '../repositories/RoomRepositories';
import { FactoryRegistry, IRoomFactory } from '../patterns/factories';
import { Room } from '../entities/Room';
import { StrategyRegistry } from '../patterns/strategies';
import { AdmissionRepository, PatientRepository } from '../repositories/PatientRepositories';

export class RoomService {
  private roomRepo = new RoomRepository();
  private typeRepo = new RoomTypeRepository();
  private staffReqRepo = new StaffAllotmentRequestRepository();
  private equipReqRepo = new EquipmentRequirementRepository();
  private admissionRepo = new AdmissionRepository();
  private patientRepo = new PatientRepository();
  private roomAllocationStrategy = StrategyRegistry.roomAllocation;
  private empAllocRepo = new EmployeeRoomAllocationRepository();

  constructor(
    private factory: IRoomFactory = FactoryRegistry.room,
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

  async listRooms() { return this.roomRepo.list(); }

  async changeStatus(roomId: number, status: Room['status']) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    room.status = status;
    return this.roomRepo.save(room as any);
  }

  async addStaffRequirement(roomId: number, role: string, count: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    const rec = this.staffReqRepo.create({ roomId: room.id, role, count, allotmentType: 'permanent', totalMinutes: null } as any);
    return this.staffReqRepo.save(rec as any);
  }

  async addEquipmentRequirement(roomId: number, equipmentType: string, count: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    const rec = this.equipReqRepo.create({ roomId: room.id, equipmentType, allotmentType: 'permanent', count, totalMinutes: null } as any);
    return this.equipReqRepo.save(rec as any);
  }

  async allocateToEmployee(userId: string, requiredRoomType: string) {
    const rooms = await this.roomRepo.list();
    let picked = this.roomAllocationStrategy.allocateRoom(rooms as any, requiredRoomType);
    if (!picked) {
      const req = (requiredRoomType || '').toLowerCase();
      picked = (rooms as any[]).find(r => (!!r.type && (r.type.name || '').toLowerCase() === req) && (r.status === 'vacant' || r.status === 'cleaning')) || null;
    }
    if (!picked) throw new Error('No room available for the requested type');
    picked.status = 'occupied';
    await this.roomRepo.save(picked as any);

    const prev = await this.empAllocRepo.find({ where: { staffId: userId, deallocatedAt: null } as any });
    for (const a of prev) {
      (a as any).deallocatedAt = new Date();
      await this.empAllocRepo.save(a as any);
    }

    const alloc = this.empAllocRepo.create({ staffId: userId, roomId: picked.id, allocatedAt: new Date(), deallocatedAt: null } as any);
    await this.empAllocRepo.save(alloc as any);

    return picked;
  }

  async admitPatientToRoom(patientId: string, roomId: number) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) throw new Error('Patient not found');
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    if (room.status !== 'vacant') throw new Error('Room not vacant');
    room.status = 'occupied';
    await this.roomRepo.save(room as any);
    const a = this.admissionRepo.create({ patientId, roomId: room.id, admittedAt: new Date(), dischargedAt: null } as any);
    return this.admissionRepo.save(a as any);
  }

  async admitPatientByType(patientId: string, requiredRoomType: string) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) throw new Error('Patient not found');
    const rooms = await this.roomRepo.list();
    let picked = this.roomAllocationStrategy.allocateRoom(rooms as any, requiredRoomType);
    if (!picked) {
      const req = (requiredRoomType || '').toLowerCase();
      picked = (rooms as any[]).find(r => (!!r.type && (r.type.name || '').toLowerCase() === req) && (r.status === 'vacant' || r.status === 'cleaning')) || null;
    }
    if (!picked) throw new Error('No room available for the requested type');
    picked.status = 'occupied';
    await this.roomRepo.save(picked as any);
    const a = this.admissionRepo.create({ patientId, roomId: picked.id, admittedAt: new Date(), dischargedAt: null } as any);
    return this.admissionRepo.save(a as any);
  }

  async vacate(roomId: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    room.status = 'vacant';
    const saved = await this.roomRepo.save(room as any);

    const actives = await this.empAllocRepo.find({ where: { roomId, deallocatedAt: null } as any });
    for (const a of actives) {
      (a as any).deallocatedAt = new Date();
      await this.empAllocRepo.save(a as any);
    }

    return saved;
  }

  async dischargePatient(patientId: string) {
    const admission = await this.admissionRepo.findOne({ where: { patientId, dischargedAt: null } as any, order: { admittedAt: 'DESC' } as any });
    if (!admission) throw new Error('Active admission not found for patient');
    admission.dischargedAt = new Date();
    await this.admissionRepo.save(admission as any);

    const room = await this.roomRepo.findById(admission.roomId);
    if (room) {
      room.status = 'vacant';
      await this.roomRepo.save(room as any);
    }
    return admission;
  }
}
