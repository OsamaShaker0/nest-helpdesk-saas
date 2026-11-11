import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from '../../interfaces/request.interface.js';
import { AddMemberDto } from '../dtos/add-member.dto.js';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class AddMemberProvider {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly usersService: UsersService,
  ) {}

  public async addMember(
    tenantId: string,
    adminPayload: JwtPayload,
    { userId }: AddMemberDto,
  ) {
    await this.assertActiveAdmin(adminPayload.id, tenantId);

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.membershipsService.addUserToTenant({
      userId: user.id,
      tenantId,
    });
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
      throw new ForbiddenException('You are not an admin of this tenant');
    }
  }
}
