import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff_allotments')
export class StaffAllotment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  staffId!: string;

  @Column({ type: 'int' })
  roomId!: number;

  @Column()
  role!: string;

  @Column({ type: 'uuid', nullable: true })
  requestId!: string | null;

  @Column({ type: 'timestamptz' })
  startAt!: Date;

  @Column({ type: 'timestamptz' })
  endAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
