import { AppointmentRepository } from '../repositories/AppointmentRepositories';
import { DoctorRepository } from '../repositories/StaffRepositories';
import { PatientRepository } from '../repositories/PatientRepositories';
import { IDoctorAppointmentStrategy, StrategyRegistry } from '../patterns/strategies';

export class AppointmentService {
  private apptRepo = new AppointmentRepository();
  private doctorRepo = new DoctorRepository();
  private patientRepo = new PatientRepository();
  private strategy: IDoctorAppointmentStrategy = StrategyRegistry.doctorAppointment;

  async createAppointment(patientId: string, timestamp: Date, speciality?: string) {
    const patient = await this.patientRepo.findById(patientId);
    if (!patient) throw new Error('Patient not found');
    const doctors = await this.doctorRepo.find();
    const chosen = this.strategy.chooseDoctor(doctors as any, speciality);
    if (!chosen) throw new Error('No doctor available');
    const appt = this.apptRepo.create({ patientId, doctorId: chosen.id, timestamp } as any);
    return this.apptRepo.save(appt as any);
  }
}
