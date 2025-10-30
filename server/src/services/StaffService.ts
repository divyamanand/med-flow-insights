import { StaffRepository, DoctorRepository, StaffTimingRepository, LeaveRepository, DoctorSpecialityRepository, SpecialityRepository } from '../repositories/StaffRepositories';
import { FactoryRegistry, IStaffFactory, IDoctorFactory } from '../patterns/factories';
import bcrypt from 'bcryptjs';

export class StaffService {
  private staffRepo = new StaffRepository();
  private docRepo = new DoctorRepository();
  private timingRepo = new StaffTimingRepository();
  private leaveRepo = new LeaveRepository();
  private specialityRepo = new DoctorSpecialityRepository();
  private specialities = new SpecialityRepository();
  private staffFactory: IStaffFactory;
  private doctorFactory: IDoctorFactory;

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
    // find existing staff and ensure role is Doctor
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) throw new Error('Staff not found');
    if (staff.role !== 'Doctor') {
      (staff as any).role = 'Doctor';
      await this.staffRepo.save(staff as any);
    }

    // if already a doctor, just attach specialities
    const existing = await this.docRepo.findOne({ where: { staffId } as any });
    const doctorEntity = existing ?? this.doctorFactory.createDoctor(staff as any);
    const savedDoctor = existing ? existing : await this.docRepo.save(doctorEntity as any);

    if (specialities && specialities.length) {
      for (const name of specialities) {
        const specRow = (await this.specialities.findByName(name)) || await this.specialities.save(this.specialities.create({ name } as any) as any);
        const link = this.specialityRepo.create({ doctorId: savedDoctor.id, specialityId: specRow.id } as any);
        await this.specialityRepo.save(link as any);
      }
    }

    const complete = await this.docRepo.findById(savedDoctor.id);
    return complete ?? savedDoctor;
  }

  async listDoctors() { return this.docRepo.find(); }

  async addTiming(staffId: string, day: string, startTime: string, endTime: string) {
    const timing = this.timingRepo.create({ staffId, day, startTime, endTime, isAvailable: true } as any);
    return this.timingRepo.save(timing as any);
  }

  async requestLeave(staffId: string, startDate: string, endDate: string) {
    const leave = this.leaveRepo.create({ staffId, startDate: new Date(startDate), endDate: new Date(endDate) } as any);
    return this.leaveRepo.save(leave as any);
  }
}
