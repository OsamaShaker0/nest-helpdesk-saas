import { Injectable } from '@nestjs/common';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { JwtPayload } from '../../interfaces/request.interface.js';
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto.js';

@Injectable()
export class UpdateMemberRoleProvider {
  constructor(private readonly membershipService: MembershipsService) {}
  public async updateMemberRole(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.membershipService.updateUserRoleInTenant(
      user,
      tenantId,
      membershipId,
      updateRoleDto,
    );
  }
}
