import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity.js';
import { MembershipRoleEnum } from './enums/membership-roles.enum.js';
import { MembershipStatusEnum } from './enums/membership-status.enum.js';
import { PaginationProvider } from '../pagination/pagination.provider.js';
import { UsersService } from '../users/users.service.js';

const PG_UNIQUE_VIOLATION = '23505';

interface MembershipChange {
  role?: MembershipRoleEnum;
  status?: MembershipStatusEnum;
}

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly paginationProvider: PaginationProvider,
    private readonly usersService: UsersService,
  ) {}

  public findActiveUserInTenant(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { tenantId, userId, status: MembershipStatusEnum.ACTIVE },
      relations: { tenant: true },
    });
  }

  public findAllInTenant(tenantId: string) {
    return this.paginationProvider.paginateResponse(Membership, { tenantId });
  }

  public async findOneInTenant(
    tenantId: string,
    membershipId: string,
  ): Promise<Membership> {
    const membership = await this.membershipRepository.findOne({
      where: { id: membershipId, tenantId },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found in this tenant');
    }
    return membership;
  }

  public async addMember(
    tenantId: string,
    userId: string,
  ): Promise<Membership> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.membershipRepository.save(
        this.membershipRepository.create({
          userId,
          tenantId,
          role: MembershipRoleEnum.SUPPORT_AGENT,
        }),
      );
    } catch (error) {
      if ((error as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('User is already a member of this tenant');
      }
      throw error;
    }
  }

  public updateRole(
    tenantId: string,
    membershipId: string,
    role: MembershipRoleEnum,
  ): Promise<Membership> {
    return this.applyChange(tenantId, membershipId, { role });
  }

  public updateStatus(
    tenantId: string,
    membershipId: string,
    status: MembershipStatusEnum,
  ): Promise<Membership> {
    return this.applyChange(tenantId, membershipId, { status });
  }

  
  private applyChange(
    tenantId: string,
    membershipId: string,
    change: MembershipChange,
  ): Promise<Membership> {
    return this.membershipRepository.manager.transaction(async (manager) => {
      const activeAdmins = await manager.find(Membership, {
        where: {
          tenantId,
          role: MembershipRoleEnum.COMPANY_ADMIN,
          status: MembershipStatusEnum.ACTIVE,
        },
        lock: { mode: 'pessimistic_write' },
      });

      const membership = await manager.findOne(Membership, {
        where: { id: membershipId, tenantId },
      });
      if (!membership) {
        throw new NotFoundException('Membership not found in this tenant');
      }

      const nextRole = change.role ?? membership.role;
      const nextStatus = change.status ?? membership.status;

      const isActiveAdminNow =
        membership.role === MembershipRoleEnum.COMPANY_ADMIN &&
        membership.status === MembershipStatusEnum.ACTIVE;
      const staysActiveAdmin =
        nextRole === MembershipRoleEnum.COMPANY_ADMIN &&
        nextStatus === MembershipStatusEnum.ACTIVE;

      if (isActiveAdminNow && !staysActiveAdmin && activeAdmins.length <= 1) {
        throw new ConflictException(
          'A tenant must keep at least one active admin',
        );
      }

      membership.role = nextRole;
      membership.status = nextStatus;
      return manager.save(membership);
    });
  }
}