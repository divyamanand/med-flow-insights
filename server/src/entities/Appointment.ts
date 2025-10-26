import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Doctor, (d) => d.appointments, { nullable: false, eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;
  @Column({ name: 'doctor_id' })
  doctorId!: string;

  @ManyToOne(() => Patient, (p) => p.appointments, { nullable: false, eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;
  @Column({ name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'timestamptz' })
  timestamp!: Date;
}
