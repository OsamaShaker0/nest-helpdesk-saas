import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import type { Relation } from 'typeorm';

@Entity('refresh_tokens')
@Index(['tokenHash'], { unique: true })
@Index(['userId'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.refreshTokens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'varchar', nullable: false })
  tokenHash: string;
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;
  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;
  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;
}
