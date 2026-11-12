import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateTenantDto } from './dtos/create-tenant.dto.js';
import { Tenant } from './entities/tenants.entity.js';
import { Membership } from '../memberships/entities/membership.entity.js';
import { MembershipRoleEnum } from '../memberships/enums/membership-roles.enum.js';
import { MembershipStatusEnum } from '../memberships/enums/membership-status.enum.js';

const PG_UNIQUE_VIOLATION = '23505';
const SLUG_TAKEN_MESSAGE = 'Slug already in use, please try another one';

@Injectable()
export class TenantsService {
  constructor(private readonly dataSource: DataSource) {}

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

  public async findMyTenants(userId: string) {
    const memberships = await this.dataSource.getRepository(Membership).find({
      where: { userId, status: MembershipStatusEnum.ACTIVE },
      relations: { tenant: true },
      order: { createdAt: 'ASC' },
    });
    return memberships.map((membership) => ({
      id: membership.tenant.id,
      name: membership.tenant.name,
      slug: membership.tenant.slug,
      status: membership.tenant.status,
      membershipId: membership.id,
      role: membership.role,
    }));
  }

  public async findOne(tenantId: string) {
    const tenant = await this.dataSource
      .getRepository(Tenant)
      .findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
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