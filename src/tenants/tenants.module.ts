import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity.js';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), MembershipsModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
