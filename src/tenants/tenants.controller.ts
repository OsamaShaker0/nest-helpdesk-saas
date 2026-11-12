import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service.js';
import { CreateTenantDto } from './dtos/create-tenant.dto.js';
import { User } from '../auth/decorators/get-user.decorator.js';
import type { JwtPayload } from '../interfaces/request.interface.js';
import { TenantContextGuard } from '../auth/guards/tenantContextGuard.guard.js';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator.js';

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

  @Get()
  public findMyTenants(@User() user: JwtPayload) {
    return this.tenantsService.findMyTenants(user.id);
  }

  @Get(':tenantId')
  @UseGuards(TenantContextGuard)
  public findOne(@CurrentTenant('tenantId') tenantId: string) {
    return this.tenantsService.findOne(tenantId);
  }
}
