import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'text', unique: true })
  token!: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
