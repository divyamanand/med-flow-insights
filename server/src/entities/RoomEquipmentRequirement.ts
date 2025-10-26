import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity('room_equipment_requirements')
export class RoomEquipmentRequirement {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  equipmentType!: string; // e.g., Ventilator, Monitor

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => Room, (room) => room.equipmentRequirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'room_id' })
  roomId!: number;
}
