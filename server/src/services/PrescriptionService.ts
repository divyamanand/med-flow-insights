import { PrescriptionRepository } from '../repositories/PrescriptionRepositories';
import { PatientRepository } from '../repositories/PatientRepositories';
import { DoctorRepository } from '../repositories/StaffRepositories';

export class PrescriptionService {
  private repo = new PrescriptionRepository();
  private patientRepo = new PatientRepository();
  private doctorRepo = new DoctorRepository();

  async listPrescriptions() {
    return this.repo.find();
  }

  async createPrescription(input: {
    patientId: string; doctorId: string; items: Record<string, number>; tests: string[]; nextVisitDateDays?: number; remarks?: string | null;
  }) {
    const p = await this.patientRepo.findById(input.patientId);
    if (!p) throw new Error('Patient not found');
    const d = await this.doctorRepo.findById(input.doctorId);
    if (!d) throw new Error('Doctor not found');
    const pr = this.repo.create({
      patientId: input.patientId,
      doctorId: input.doctorId,
      items: input.items,
      tests: input.tests,
      nextVisitDateDays: input.nextVisitDateDays ?? 15,
      remarks: input.remarks ?? null,
    } as any);
    return this.repo.save(pr as any);
  }
}
