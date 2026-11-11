import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity.js';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';
import { AddMemberProvider } from './providers/add-member.provider.js';
import { ListMembersProvider } from './providers/list-members.provider.js';
import { GetMemberProvider } from './providers/get-member.provider.js';
import { UpdateMemberRoleProvider } from './providers/update-member-role.provider.js';
import  {UpdateMembershipStatusProvider} from "./providers/update-member-status.provider.js"
import { MembershipsModule } from '../memberships/memberships.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), MembershipsModule , UsersModule],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    AddMemberProvider,
    ListMembersProvider,
    GetMemberProvider,
    UpdateMemberRoleProvider,
    UpdateMembershipStatusProvider,
  ],
})
export class TenantsModule {}
