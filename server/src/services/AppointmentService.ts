import { AppointmentRepository } from '../repositories/AppointmentRepositories';
import { DoctorRepository } from '../repositories/StaffRepositories';
import { PatientRepository } from '../repositories/PatientRepositories';
import { IDoctorAppointmentStrategy, StrategyRegistry } from '../patterns/strategies';
import { IssueService } from './IssueService';

export class AppointmentService {
  private apptRepo = new AppointmentRepository();
  private doctorRepo = new DoctorRepository();
  private patientRepo = new PatientRepository();
  private strategy: IDoctorAppointmentStrategy = StrategyRegistry.doctorAppointment;
  private issueService = new IssueService();

  async getRequiredSpecialitiesForIssues(issues: string[]): Promise<string[]> {
    return this.issueService.getRequiredSpecialitiesForIssues(issues);
  }

  async createAppointmentForAnyDoctor(patientId: string, timestamp: Date, issues: string[], duration?: number) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) throw new Error('Patient not found');
    const doctors = await this.doctorRepo.find();
    const requiredSpecialities = await this.getRequiredSpecialitiesForIssues(issues)
    const chosen = this.strategy.chooseDoctor(doctors as any, requiredSpecialities);
    if (!chosen) throw new Error('No doctor available');
    const appt = this.apptRepo.create({ patientId, doctorId: chosen.id, timestamp, duration: duration ?? 15 } as any);
    return this.apptRepo.save(appt as any);
  }

  async createAppointment(patientId: string, timestamp: Date, speciality?: string, doctorId?: string, duration?: number) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) throw new Error('Patient not found');


    if (doctorId) {
      const doctor = await this.doctorRepo.findById(doctorId);
      if (!doctor) throw new Error('Doctor not found');
      const appt = this.apptRepo.create({ patientId, doctorId: doctor.id, timestamp, duration: duration ?? 15 } as any);
      return this.apptRepo.save(appt as any);
    }

    const doctors = await this.doctorRepo.find();
    const required = speciality ? [speciality] : [];
    const chosen = this.strategy.chooseDoctor(doctors as any, required);
    if (!chosen) throw new Error('No doctor available');
    const appt = this.apptRepo.create({ patientId, doctorId: chosen.id, timestamp, duration: duration ?? 15 } as any);
    return this.apptRepo.save(appt as any);
  }
}
