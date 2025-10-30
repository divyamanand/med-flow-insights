import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity('equipment_requirements')
export class EquipmentRequirement {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'room_id' })
  roomId!: number;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column()
  equipmentType!: string; // e.g., Ventilator, Monitor

  @Column({ type: 'varchar', length: 20, default: 'permanent' })
  allotmentType!: 'temporary' | 'permanent';

  @Column({ type: 'int', nullable: true })
  totalMinutes!: number | null; // for temporary

  @Column({ type: 'int', nullable: true })
  count!: number | null; // for permanent target count in room

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
