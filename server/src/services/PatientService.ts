import { PatientRepository, PatientIssueRepository, AdmissionRepository } from '../repositories/PatientRepositories';
import { RoomRepository } from '../repositories/RoomRepositories';
import { createHash } from 'crypto';

export class PatientService {
  private patientRepo = new PatientRepository();
  private issueRepo = new PatientIssueRepository();
  private admissionRepo = new AdmissionRepository();
  private roomRepo = new RoomRepository();

  private hash(pw: string) { return createHash('sha256').update(pw).digest('hex'); }

  async createPatient(input: {
    firstName: string; lastName: string; dob: string; gender: string; email: string; contact: string; bloodGroup?: string; password: string;
  }) {
    const p = this.patientRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      dob: input.dob,
      gender: input.gender,
      email: input.email,
      contact: input.contact,
      bloodGroup: input.bloodGroup ?? null,
      passwordHash: this.hash(input.password),
    } as any);
    return this.patientRepo.save(p as any);
  }

  async addIssue(patientId: string, issue: string) {
    const i = this.issueRepo.create({ patientId, issue, solved: false } as any);
    return this.issueRepo.save(i as any);
  }

  async admit(patientId: string, roomId: number) {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    if (room.status !== 'vacant') throw new Error('Room not vacant');
    room.status = 'occupied';
    await this.roomRepo.save(room as any);
    const a = this.admissionRepo.create({ patientId, roomId, admittedAt: new Date(), dischargedAt: null } as any);
    return this.admissionRepo.save(a as any);
  }
}
