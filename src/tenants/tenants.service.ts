import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateTenantDto } from './dtos/create-tenant.dto.js';
import { Tenant } from './entities/tenants.entity.js';
import { Membership } from '../memberships/entities/membership.entity.js';
import { MembershipRoleEnum } from '../memberships/enums/membership-roles.enum.js';
import { AddMemberProvider } from './providers/add-member.provider.js';
import { JwtPayload } from '../interfaces/request.interface.js';
import { AddMemberDto } from './dtos/add-member.dto.js';
import { ListMembersProvider } from './providers/list-members.provider.js';
import { GetMemberProvider } from './providers/get-member.provider.js';
import { UpdateMemberRoleProvider } from './providers/update-member-role.provider.js';
import { useContainer } from 'class-validator';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto.js';
import { UpdateMembershipStatusDto } from '../memberships/dtos/update-membership-status.endpoints.js';
import { UpdateMembershipStatusProvider } from './providers/update-member-status.provider.js';

const PG_UNIQUE_VIOLATION = '23505';
const SLUG_TAKEN_MESSAGE = 'Slug already in use, please try another one';

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly addMemberProvider: AddMemberProvider,
    private readonly listMembersProvider: ListMembersProvider,
    private readonly getMemberProvider: GetMemberProvider,
    private readonly updateMemberRoleProvider: UpdateMemberRoleProvider,
    private readonly updateMembershipStatusProvider: UpdateMembershipStatusProvider,
  ) {}

  public async create(userId: string, dto: CreateTenantDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        await this.assertSlugAvailable(manager, dto.slug);

        const tenant = await manager.save(
          manager.create(Tenant, { name: dto.name, slug: dto.slug }),
        );

        const membership = await manager.save(
          manager.create(Membership, {
            userId,
            tenantId: tenant.id,
            role: MembershipRoleEnum.COMPANY_ADMIN,
          }),
        );

        return { tenant, membership };
      });
    } catch (error) {
      if ((error as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException(SLUG_TAKEN_MESSAGE);
      }
      throw error;
    }
  }

  public addMember(
    tenantId: string,
    adminPayload: JwtPayload,
    addMemberDto: AddMemberDto,
  ) {
    return this.addMemberProvider.addMember(
      tenantId,
      adminPayload,
      addMemberDto,
    );
  }

  public getAllMembers(tenantId: string, user: JwtPayload) {
    return this.listMembersProvider.getAllMembers(tenantId, user);
  }

  public getOneMember(user: JwtPayload, tenantId: string, memberId: string) {
    return this.getMemberProvider.getMemberInTenant(user, tenantId, memberId);
  }
  public updateUserRoleInTenant(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.updateMemberRoleProvider.updateMemberRole(
      user,
      tenantId,
      membershipId,
      updateRoleDto,
    );
  }
  public updateMembershipStatus(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    return this.updateMembershipStatusProvider.updateMembershipStatus(
      user,
      tenantId,
      membershipId,
      updateMembershipStatusDto,
    );
  }

  private async assertSlugAvailable(
    manager: EntityManager,
    slug: string,
  ): Promise<void> {
    const exists = await manager.exists(Tenant, { where: { slug } });
    if (exists) {
      throw new ConflictException(SLUG_TAKEN_MESSAGE);
    }
  }
}
