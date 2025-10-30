import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from './Staff';
import { Room } from './Room';

@Entity('employee_room_allocations')
export class EmployeeRoomAllocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Staff, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff!: Staff;
  @Column({ name: 'staff_id' })
  staffId!: string;

  @ManyToOne(() => Room, { eager: true, nullable: false })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @Column({ name: 'room_id' })
  roomId!: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  allocatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deallocatedAt!: Date | null;
}
