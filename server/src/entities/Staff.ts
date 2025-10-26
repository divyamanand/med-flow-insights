import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Leave } from './Leave';
import { StaffTiming } from './StaffTiming';
import { Doctor } from './Doctor';

@Entity('staff')
export class Staff {
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

  @Column()
  role!: string; // e.g., Nurse, Technician, Admin, Doctor

  @Column({ select: false })
  passwordHash!: string; // placeholder

  @OneToMany(() => StaffTiming, (t) => t.staff)
  timings!: StaffTiming[];

  @OneToMany(() => Leave, (l) => l.staff)
  leaves!: Leave[];

  @OneToOne(() => Doctor, (d) => d.staff)
  doctor?: Doctor;
}
