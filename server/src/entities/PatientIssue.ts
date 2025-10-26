import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './Patient';

@Entity('patient_issues')
export class PatientIssue {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Patient, (p) => p.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;
  @Column({ name: 'patient_id' })
  patientId!: string;

  @Column()
  issue!: string;

  @Column({ default: false })
  solved!: boolean;
}
