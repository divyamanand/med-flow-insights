import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from './Staff';

@Entity('staff_timings')
export class StaffTiming {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Staff, (s) => s.timings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff!: Staff;

  @Column({ name: 'staff_id' })
  staffId!: string;

  @Column()
  day!: string; // e.g., Mon

  @Column()
  startTime!: string; // e.g., 09:00

  @Column()
  endTime!: string;

  @Column({ default: true })
  isAvailable!: boolean;
}
