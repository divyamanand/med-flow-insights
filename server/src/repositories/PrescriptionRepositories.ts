import { BaseRepository } from './BaseRepository';
import { Prescription } from '../entities/Prescription';

export class PrescriptionRepository extends BaseRepository<Prescription> {
  constructor() { super(Prescription); }
}
