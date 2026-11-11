import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { JwtPayload } from '../../interfaces/request.interface.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class GetMemberProvider {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly usersService: UsersService,
  ) {}

  public async getMemberInTenant(
    requester: JwtPayload,
    tenantId: string,
    memberId: string,
  ) {
    await this.assertActiveAdmin(requester.id, tenantId);

    const membership = await this.membershipsService.findActiveUserInTenant(
      tenantId,
      memberId,
    );
    if (!membership) {
      throw new NotFoundException('Member not found in this tenant');
    }

    return this.usersService.findUserById(membership.userId);
  }

  private async assertActiveAdmin(
    adminId: string,
    tenantId: string,
  ): Promise<void> {
    const admin = await this.membershipsService.findActiveAdminInTenant({
      adminId,
      tenantId,
    });
    if (!admin) {
      throw new ForbiddenException('You do not have access to this tenant');
    }
  }
}
