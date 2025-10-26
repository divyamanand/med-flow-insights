import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomType } from './RoomType';
import { RoomStaffRequirement } from './RoomStaffRequirement';
import { RoomEquipmentRequirement } from './RoomEquipmentRequirement';

export type RoomStatus = 'vacant' | 'occupied' | 'maintenance' | 'cleaning';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'int', unique: true })
  roomNumber!: number;

  @Column()
  roomName!: string;

  @Column({ type: 'varchar', default: 'vacant' })
  status!: RoomStatus;

  @ManyToOne(() => RoomType, (type) => type.rooms, { eager: true, nullable: false })
  @JoinColumn({ name: 'type_id' })
  type!: RoomType;

  @Column({ name: 'type_id' })
  typeId!: number;

  @OneToMany(() => RoomStaffRequirement, (req) => req.room)
  staffRequirements!: RoomStaffRequirement[];

  @OneToMany(() => RoomEquipmentRequirement, (req) => req.room)
  equipmentRequirements!: RoomEquipmentRequirement[];
}
