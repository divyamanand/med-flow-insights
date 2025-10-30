import { PatientRepository, PatientIssueRepository } from '../repositories/PatientRepositories';
import { createHash } from 'crypto';
import { RoomService } from './RoomService';

export class PatientService {
  private patientRepo = new PatientRepository();
  private issueRepo = new PatientIssueRepository();
  private roomService = new RoomService();
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
    return this.roomService.admitPatientToRoom(patientId, roomId);
  }

  async discharge(patientId: string) {
    return this.roomService.dischargePatient(patientId);
  }
  
}
