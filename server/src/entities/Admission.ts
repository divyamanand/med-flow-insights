import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './Patient';
import { Room } from './Room';

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Patient, (p) => p.admissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;
  @Column({ name: 'patient_id' })
  patientId!: string;

  @ManyToOne(() => Room, { eager: true, nullable: false })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @Column({ name: 'room_id' })
  roomId!: number;

  @Column({ type: 'timestamptz' })
  admittedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  dischargedAt!: Date | null;
}
