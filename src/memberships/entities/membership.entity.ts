import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { MembershipRoleEnum } from '../enums/membership-roles.enum.js';
import { MembershipStatusEnum } from '../enums/membership-status.enum.js';
import { Tenant } from '../../tenants/entities/tenants.entity.js';

@Entity('memberships')
@Unique('UQ_memberships_user_tenant', ['userId', 'tenantId'])
@Index(['tenantId'])
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'enum', enum: MembershipRoleEnum, nullable: false })
  role: MembershipRoleEnum;

  @Column({
    type: 'enum',
    enum: MembershipStatusEnum,
    default: MembershipStatusEnum.ACTIVE,
  })
  status: MembershipStatusEnum;
  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Relation<Tenant>;

  @Column({ type: 'uuid' })
  tenantId: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
