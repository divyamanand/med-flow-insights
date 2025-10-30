import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './Patient';
import { Issue } from './Issue';

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

  @ManyToOne(() => Issue, { nullable: true })
  @JoinColumn({ name: 'issue_id' })
  issueRef?: Issue | null;
  @Column({ name: 'issue_id', type: 'int', nullable: true })
  issueId!: number | null;

  @Column({ default: false })
  solved!: boolean;
}
