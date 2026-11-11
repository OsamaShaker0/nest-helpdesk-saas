import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Membership } from './entities/membership.entity.js';
import { GetAdminInTenant } from './dtos/get-admin-in-tenant.dto.js';
import { AddUserToTenantDto } from './dtos/add-user-to-tenant.dto.js';
import { MembershipRoleEnum } from './enums/membership-roles.enum.js';
import { MembershipStatusEnum } from './enums/membership-status.enum.js';
import { PaginationProvider } from '../pagination/pagination.provider.js';
import { JwtPayload } from '../interfaces/request.interface.js';
import { UpdateUserRoleDto } from '../tenants/dtos/update-user-role.dto.js';
import { UpdateMembershipStatusDto } from './dtos/update-membership-status.endpoints.js';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public findActiveAdminInTenant({
    adminId,
    tenantId,
  }: GetAdminInTenant): Promise<Membership | null> {
    return this.findOneInTenant(tenantId, adminId, {
      role: MembershipRoleEnum.COMPANY_ADMIN,
      status: MembershipStatusEnum.ACTIVE,
    });
  }

  public findInactiveAdminInTenant({
    adminId,
    tenantId,
  }: GetAdminInTenant): Promise<Membership | null> {
    return this.findOneInTenant(tenantId, adminId, {
      role: MembershipRoleEnum.COMPANY_ADMIN,
      status: Not(MembershipStatusEnum.ACTIVE),
    });
  }

  public findActiveUserInTenant(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null> {
    return this.findOneInTenant(tenantId, userId, {
      status: MembershipStatusEnum.ACTIVE,
    });
  }

  public findInactiveUserInTenant(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null> {
    return this.findOneInTenant(tenantId, userId, {
      status: Not(MembershipStatusEnum.ACTIVE),
    });
  }

  public findAllMembersInTenant(tenantId: string) {
    return this.paginationProvider.paginateResponse(Membership, {
      tenantId,
      status: MembershipStatusEnum.ACTIVE,
    });
  }

  public async addUserToTenant({
    userId,
    tenantId,
  }: AddUserToTenantDto): Promise<Membership> {
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

  public async removeUserFromTenant(
    tenantId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.membershipRepository.delete({
      tenantId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('User is not a member of this tenant');
    }
  }
  public async updateUserRoleInTenant(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateRoleDto: UpdateUserRoleDto,
  ) {
    let admin = await this.findActiveAdminInTenant({
      adminId: user.id,
      tenantId,
    });
    if (admin == null) {
      return new ForbiddenException('You do not have access');
    }
    let membership = await this.membershipRepository.findOne({
      where: { tenantId, id: membershipId },
    });
    if (!membership) {
      throw new BadRequestException('user not found ');
    }
    membership.role = updateRoleDto.role;
    return await this.membershipRepository.save(membership);
  }
  public async updateMembershipStatus(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    let admin = await this.findActiveAdminInTenant({
      adminId: user.id,
      tenantId,
    });
    if (admin == null) {
      return new ForbiddenException('You do not have access');
    }
    let membership = await this.membershipRepository.findOne({
      where: { tenantId, id: membershipId },
    });
    if (!membership) {
      throw new BadRequestException('user not found ');
    }
    membership.status = updateMembershipStatusDto.status;
    return await this.membershipRepository.save(membership);
  }

  private findOneInTenant(
    tenantId: string,
    userId: string,
    extraWhere: FindOptionsWhere<Membership> = {},
  ): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { tenantId, userId, ...extraWhere },
    });
  }
}
