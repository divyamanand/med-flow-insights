import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './Doctor';
import { Speciality } from './Speciality';

@Entity('doctor_specialities')
export class DoctorSpeciality {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Doctor, (d) => d.specialities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;
  @Column({ name: 'doctor_id' })
  doctorId!: string;

  @ManyToOne(() => Speciality, (s) => s.doctorLinks, { eager: true, nullable: false })
  @JoinColumn({ name: 'speciality_id' })
  speciality!: Speciality;
  @Column({ name: 'speciality_id' })
  specialityId!: number;
}
