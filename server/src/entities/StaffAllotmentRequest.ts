import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff_allotment_requests')
export class StaffAllotmentRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  roomId!: number;

  @Column()
  role!: string;

  @Column({ type: 'int' })
  totalMinutes!: number;

  @Column({ type: 'int' })
  remainingMinutes!: number;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
