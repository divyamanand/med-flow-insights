import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff_allotment_requests')
export class StaffAllotmentRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  roomId!: number;

  @Column()
  role!: string;

  // 'temporary' requests use totalMinutes; 'permanent' requirements use count
  @Column({ type: 'varchar', length: 20, default: 'temporary' })
  allotmentType!: 'temporary' | 'permanent';

  @Column({ type: 'int', nullable: true })
  totalMinutes!: number | null;

  @Column({ type: 'int', nullable: true })
  count!: number | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
