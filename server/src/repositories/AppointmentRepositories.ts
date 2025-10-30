import { BaseRepository } from './BaseRepository';
import { Appointment } from '../entities/Appointment';

export class AppointmentRepository extends BaseRepository<Appointment> {
  constructor() { super(Appointment); }
}
