import { StaffRepository, DoctorRepository, StaffTimingRepository, LeaveRepository, DoctorSpecialityRepository } from '../repositories/StaffRepositories';
import { FactoryRegistry, IStaffFactory, IDoctorFactory } from '../patterns/factories';
import { StrategyRegistry } from '../patterns/strategies';
import { Staff } from '../entities/Staff';
import bcrypt from 'bcryptjs';

export class StaffService {
  private staffRepo = new StaffRepository();
  private docRepo = new DoctorRepository();
  private timingRepo = new StaffTimingRepository();
  private leaveRepo = new LeaveRepository();
  private specialityRepo = new DoctorSpecialityRepository();
  private staffFactory: IStaffFactory;
  private doctorFactory: IDoctorFactory;
  private allotment = StrategyRegistry.staffAllotment as any;

  constructor(
    staffFactory: IStaffFactory = FactoryRegistry.staff,
    doctorFactory: IDoctorFactory = FactoryRegistry.doctor,
  ) {
    this.staffFactory = staffFactory;
    this.doctorFactory = doctorFactory;
  }

  private async hash(pw: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pw, salt);
  }

  async createStaff(input: {
    firstName: string; lastName: string; dob: string; gender: string; email: string; contact: string; bloodGroup?: string; role: string; password: string;
  }) {
  const staff = this.staffFactory.createStaff({
      firstName: input.firstName,
      lastName: input.lastName,
      dob: input.dob,
      gender: input.gender,
      email: input.email,
      contact: input.contact,
      bloodGroup: input.bloodGroup ?? null,
      role: input.role,
      passwordHash: await this.hash(input.password),
    } as any);
    return this.staffRepo.save(staff as any);
  }

  async createDoctor(staffId: string, specialities?: string[]) {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) throw new Error('Staff not found');
    const doctor = this.doctorFactory.createDoctor(staff);
    const saved = await this.docRepo.save(doctor as any);
    if (specialities && specialities.length) {
      for (const s of specialities) {
        const spec = this.specialityRepo.create({ doctorId: saved.id, doctor: saved as any, speciality: s });
        await this.specialityRepo.save(spec as any);
      }
    }
    return saved;
  }

  listDoctors() { return this.docRepo.find(); }

  async addTiming(staffId: string, day: string, startTime: string, endTime: string) {
    const timing = this.timingRepo.create({ staffId, day, startTime, endTime, isAvailable: true } as any);
    return this.timingRepo.save(timing as any);
  }

  async requestLeave(staffId: string, startDate: string, endDate: string) {
    const leave = this.leaveRepo.create({ staffId, startDate: new Date(startDate), endDate: new Date(endDate) } as any);
    return this.leaveRepo.save(leave as any);
  }
}
