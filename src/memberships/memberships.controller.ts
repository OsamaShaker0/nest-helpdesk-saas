import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import { AddMemberDto } from './dtos/add-member.dto.js';
import { UpdateMembershipRoleDto } from './dtos/update-membership-role.dto.js';
import { UpdateMembershipStatusDto } from './dtos/update-membership-status.endpoints.js';
import { MembershipRoleEnum } from './enums/membership-roles.enum.js';
import { TenantContextGuard } from '../auth/guards/tenantContextGuard.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator.js';
import type { TenantContext } from '../interfaces/tenantContext.interface.js';

@Controller('tenants/:tenantId/memberships')
@UseGuards(TenantContextGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('me')
  public getMyMembership(@CurrentTenant() tenantContext: TenantContext) {
    return tenantContext;
  }

  @Get()
  @Roles(MembershipRoleEnum.COMPANY_ADMIN)
  public list(@CurrentTenant('tenantId') tenantId: string) {
    return this.membershipsService.findAllInTenant(tenantId);
  }

  @Post()
  @Roles(MembershipRoleEnum.COMPANY_ADMIN)
  public add(
    @CurrentTenant('tenantId') tenantId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.membershipsService.addMember(tenantId, dto.userId);
  }

  @Get(':membershipId')
  @Roles(MembershipRoleEnum.COMPANY_ADMIN)
  public getOne(
    @CurrentTenant('tenantId') tenantId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    return this.membershipsService.findOneInTenant(tenantId, membershipId);
  }

  @Patch(':membershipId')
  @Roles(MembershipRoleEnum.COMPANY_ADMIN)
  public updateRole(
    @CurrentTenant('tenantId') tenantId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @Body() dto: UpdateMembershipRoleDto,
  ) {
    return this.membershipsService.updateRole(tenantId, membershipId, dto.role);
  }

  @Patch(':membershipId/status')
  @Roles(MembershipRoleEnum.COMPANY_ADMIN)
  public updateStatus(
    @CurrentTenant('tenantId') tenantId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @Body() dto: UpdateMembershipStatusDto,
  ) {
    return this.membershipsService.updateStatus(
      tenantId,
      membershipId,
      dto.status,
    );
  }
}
