import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from './Staff';
import { Appointment } from './Appointment';
import { Prescription } from './Prescription';
import { DoctorSpeciality } from './DoctorSpeciality';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Staff, (s) => s.doctor, { eager: true, nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff!: Staff;
  @Column({ name: 'staff_id' })
  staffId!: string;

  @OneToMany(() => Appointment, (a) => a.doctor)
  appointments!: Appointment[];

  @OneToMany(() => Prescription, (p) => p.doctor)
  prescriptions!: Prescription[];

  @OneToMany(() => DoctorSpeciality, (s) => s.doctor, { cascade: true })
  specialities!: DoctorSpeciality[];
}
