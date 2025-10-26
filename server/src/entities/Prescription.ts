import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './Patient';
import { Doctor } from './Doctor';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Patient, (p) => p.prescriptions, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;
  @Column({ name: 'patient_id' })
  patientId!: string;

  @ManyToOne(() => Doctor, (d) => d.prescriptions, { nullable: false })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;
  @Column({ name: 'doctor_id' })
  doctorId!: string;

  @Column({ type: 'jsonb' })
  items!: Record<string, number>; // name -> quantity

  @Column({ type: 'text', array: true, default: '{}' })
  tests!: string[];

  @Column({ type: 'int', default: 15 })
  nextVisitDateDays!: number;

  @Column({ type: 'text', nullable: true })
  remarks!: string | null;
}
