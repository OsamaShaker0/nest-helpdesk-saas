import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from '../enums/user-status.enum.js';
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  passwordHash: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  lastName: string;
  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  emailVerifiedAt?: Date | null;
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
