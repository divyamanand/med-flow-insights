import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string; // e.g., LabRoom, OperationRoom, GenericRoom

  @OneToMany(() => Room, (room) => room.type)
  rooms!: Room[];
}
