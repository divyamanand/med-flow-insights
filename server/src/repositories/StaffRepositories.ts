import { BaseRepository } from './BaseRepository';
import { Staff } from '../entities/Staff';
import { Doctor } from '../entities/Doctor';
import { StaffTiming } from '../entities/StaffTiming';
import { Leave } from '../entities/Leave';
import { DoctorSpeciality } from '../entities/DoctorSpeciality';

export class StaffRepository extends BaseRepository<Staff> {
  constructor() { super(Staff); }
  findByEmail(email: string) { return this.findOne({ where: { email } }); }
  findAuthByEmail(email: string) {
    return this.repo.createQueryBuilder('s')
      .addSelect('s.passwordHash')
      .where('s.email = :email', { email })
      .getOne();
  }
}

export class DoctorRepository extends BaseRepository<Doctor> {
  constructor() { super(Doctor); }
}

export class StaffTimingRepository extends BaseRepository<StaffTiming> {
  constructor() { super(StaffTiming); }
}

export class LeaveRepository extends BaseRepository<Leave> {
  constructor() { super(Leave); }
}

export class DoctorSpecialityRepository extends BaseRepository<DoctorSpeciality> {
  constructor() { super(DoctorSpeciality); }
}
