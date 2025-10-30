import { IssueRepository, IssueSpecialityRepository } from '../repositories/IssueRepositories';
import { SpecialityRepository } from '../repositories/StaffRepositories';

export class IssueService {
  private issueRepo = new IssueRepository();
  private issueSpecRepo = new IssueSpecialityRepository();
  private specRepo = new SpecialityRepository();

  async createIssue(name: string, description?: string) {
    const existing = await this.issueRepo.findByName(name);
    if (existing) return existing;
    const i = this.issueRepo.create({ name, description: description ?? null } as any);
    return this.issueRepo.save(i as any);
  }

  async createSpeciality(name: string, description?: string) {
    const existing = await this.specRepo.findByName(name);
    if (existing) return existing;
    const s = this.specRepo.create({ name, description: description ?? null } as any);
    return this.specRepo.save(s as any);
  }

  async mapIssueToSpeciality(issueName: string, specialityName: string) {
    const issue = await this.createIssue(issueName);
    const spec = await this.createSpeciality(specialityName);
    const existing = await this.issueSpecRepo.find({ where: { issueId: issue.id, specialityId: spec.id } as any });
    if (existing.length) return existing[0];
    const link = this.issueSpecRepo.create({ issueId: issue.id, specialityId: spec.id } as any);
    return this.issueSpecRepo.save(link as any);
  }

  async getRequiredSpecialitiesForIssues(issues: string[]): Promise<string[]> {
    const out = new Set<string>();
    for (const nm of issues || []) {
      const issue = await this.issueRepo.findByName(nm);
      if (!issue) continue;
      const links = await this.issueSpecRepo.find({ where: { issueId: issue.id } as any });
      for (const link of links as any[]) {
        const spec = await this.specRepo.findById(link.specialityId);
        if (spec) out.add(spec.name);
      }
    }
    return Array.from(out);
  }
}
