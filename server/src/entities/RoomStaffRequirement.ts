import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity('room_staff_requirements')
export class RoomStaffRequirement {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  role!: string; // e.g., Nurse, Technician

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => Room, (room) => room.staffRequirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'room_id' })
  roomId!: number;
}
