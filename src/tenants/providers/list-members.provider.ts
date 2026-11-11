import { ForbiddenException, Injectable } from '@nestjs/common';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { JwtPayload } from '../../interfaces/request.interface.js';

@Injectable()
export class ListMembersProvider {
  constructor(private readonly membershipService: MembershipsService) {}
  public async getAllMembers(tenantId: string, user: JwtPayload) {
    let admin = await this.membershipService.findActiveAdminInTenant({
      adminId: user.id,
      tenantId: tenantId,
    });
    if (admin == null) {
      throw new ForbiddenException('You are not an admin of this tenant');
    }

    const members =
      await this.membershipService.findAllMembersInTenant(tenantId);
    return members;
  }
}
