import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from './Staff';

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Staff, (s) => s.leaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff!: Staff;
  @Column({ name: 'staff_id' })
  staffId!: string;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
  endDate!: Date;
}
