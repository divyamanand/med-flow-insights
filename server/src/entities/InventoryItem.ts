import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InventoryStock } from './InventoryStock';

export type InventoryKind = 'medicine' | 'blood' | 'equipment';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  kind!: InventoryKind; // discriminator

  @Column({ type: 'varchar', nullable: true })
  name!: string | null; // for medicine/equipment

  @Column({ type: 'varchar', nullable: true })
  manufacturer!: string | null; // for medicine/equipment

  @Column({ type: 'varchar', nullable: true })
  bloodGroup!: string | null; // for blood

  @OneToMany(() => InventoryStock, (s) => s.item)
  stocks!: InventoryStock[];
}
