import { BaseRepository } from './BaseRepository';
import { StaffAllotment } from '../entities/StaffAllotment';
import { StaffAllotmentRequest } from '../entities/StaffAllotmentRequest';

export class StaffAllotmentRepository extends BaseRepository<StaffAllotment> {
  constructor() { super(StaffAllotment); }
}

export class StaffAllotmentRequestRepository extends BaseRepository<StaffAllotmentRequest> {
  constructor() { super(StaffAllotmentRequest); }
}
