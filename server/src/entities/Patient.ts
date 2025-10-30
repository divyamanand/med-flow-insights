import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientIssue } from './PatientIssue';
import { Admission } from './Admission';
import { Appointment } from './Appointment';
import { Prescription } from './Prescription';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'date' })
  dob!: string;

  @Column()
  gender!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  contact!: string;

  @Column({ type: 'varchar', nullable: true })
  bloodGroup!: string | null;

  @Column({ select: false })
  passwordHash!: string;

  @OneToMany(() => PatientIssue, (i) => i.patient)
  issues!: PatientIssue[];

  @OneToMany(() => Admission, (a) => a.patient)
  admissions!: Admission[];

  @OneToMany(() => Appointment, (a) => a.patient)
  appointments!: Appointment[];

  @OneToMany(() => Prescription, (p) => p.patient)
  prescriptions!: Prescription[];
}
