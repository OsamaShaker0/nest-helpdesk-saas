import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dtos/create-tenant.dto.js';
import { User } from '../auth/decorators/get-user.decorator.js';
import type { JwtPayload } from '../interfaces/request.interface.js';
import { AddMemberDto } from './dtos/add-member.dto.js';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto.js';
import { UpdateMembershipStatusDto } from '../memberships/dtos/update-membership-status.endpoints.js';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  public createTenant(
    @User() user: JwtPayload,
    @Body() createTenantDto: CreateTenantDto,
  ) {
    return this.tenantsService.create(user.id, createTenantDto);
  }

  @Post(':tenantId/memberships')
  public addMember(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @User() user: JwtPayload,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.tenantsService.addMember(tenantId, user, addMemberDto);
  }

  @Get(':tenantId/memberships')
  public getAllMembersInTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @User() user: JwtPayload,
  ) {
    return this.tenantsService.getAllMembers(tenantId, user);
  }

  @Get(':tenantId/memberships/:memberId')
  public getOneMemberInTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @User() user: JwtPayload,
  ) {
    return this.tenantsService.getOneMember(user, tenantId, memberId);
  }
  @Patch(':tenantId/memberships/:membershipId')
  public updateMemberRoleInTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @User() user: JwtPayload,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.tenantsService.updateUserRoleInTenant(
      user,
      tenantId,
      membershipId,
      updateRoleDto,
    );
  }
  @Patch(':tenantId/memberships/:membershipId/status')
  public updateMembershipStatus(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
    @User() user: JwtPayload,
    @Body() updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    return this.tenantsService.updateMembershipStatus(
      user,
      tenantId,
      membershipId,
      updateMembershipStatusDto,
    );
  }
}
