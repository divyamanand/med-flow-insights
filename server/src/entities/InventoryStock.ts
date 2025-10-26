import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryItem } from './InventoryItem';

@Entity('inventory_stocks')
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => InventoryItem, (i) => i.stocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item!: InventoryItem;
  @Column({ name: 'item_id' })
  itemId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date; // used for FIFO ordering
}
