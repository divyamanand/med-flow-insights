import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './Doctor';

@Entity('doctor_specialities')
export class DoctorSpeciality {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Doctor, (d) => d.specialities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;
  @Column({ name: 'doctor_id' })
  doctorId!: string;

  @Column()
  speciality!: string;
}
