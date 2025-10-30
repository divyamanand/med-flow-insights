import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryItem } from './InventoryItem';

@Entity('equipment_allotments')
export class EquipmentAllotment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => InventoryItem, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item!: InventoryItem;
  @Column({ name: 'item_id' })
  itemId!: string;

  @Column({ type: 'int' })
  roomId!: number;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'timestamptz' })
  startAt!: Date;

  @Column({ type: 'timestamptz' })
  endAt!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
