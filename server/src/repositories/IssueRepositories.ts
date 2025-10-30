import { BaseRepository } from './BaseRepository';
import { Issue } from '../entities/Issue';
import { IssueSpeciality } from '../entities/IssueSpeciality';

export class IssueRepository extends BaseRepository<Issue> {
  constructor() { super(Issue); }
  findByName(name: string) { return this.findOne({ where: { name } }); }
}

export class IssueSpecialityRepository extends BaseRepository<IssueSpeciality> {
  constructor() { super(IssueSpeciality); }
}
