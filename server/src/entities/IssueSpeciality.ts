import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Issue } from './Issue';
import { Speciality } from './Speciality';

@Entity('issue_specialities')
export class IssueSpeciality {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Issue, (i) => i.specialities, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'issue_id' })
  issue!: Issue;
  @Column({ name: 'issue_id' })
  issueId!: number;

  @ManyToOne(() => Speciality, (s) => s.issueLinks, { onDelete: 'CASCADE', nullable: false, eager: true })
  @JoinColumn({ name: 'speciality_id' })
  speciality!: Speciality;
  @Column({ name: 'speciality_id' })
  specialityId!: number;
}
