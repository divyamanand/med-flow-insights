import { BaseRepository } from './BaseRepository';
import { Patient } from '../entities/Patient';
import { PatientIssue } from '../entities/PatientIssue';
import { Admission } from '../entities/Admission';

export class PatientRepository extends BaseRepository<Patient> {
  constructor() { super(Patient); }
  findByEmail(email: string) { return this.findOne({ where: { email } }); }
}

export class PatientIssueRepository extends BaseRepository<PatientIssue> {
  constructor() { super(PatientIssue); }
}

export class AdmissionRepository extends BaseRepository<Admission> {
  constructor() { super(Admission); }
}
