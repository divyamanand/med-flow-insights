import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorSpeciality } from './DoctorSpeciality';
import { IssueSpeciality } from './IssueSpeciality';

@Entity('specialities')
export class Speciality {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => DoctorSpeciality, (ds) => ds.speciality)
  doctorLinks!: DoctorSpeciality[];

  @OneToMany(() => IssueSpeciality, (ispec) => ispec.speciality)
  issueLinks!: IssueSpeciality[];
}
