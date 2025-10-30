import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IssueSpeciality } from './IssueSpeciality';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => IssueSpeciality, (ispec) => ispec.issue)
  specialities!: IssueSpeciality[];
}
