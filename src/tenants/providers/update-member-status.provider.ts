import { Injectable } from '@nestjs/common';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { JwtPayload } from '../../interfaces/request.interface.js';
import { UpdateMembershipStatusDto } from '../../memberships/dtos/update-membership-status.endpoints.js';

@Injectable()
export class UpdateMembershipStatusProvider {
  constructor(private readonly membershipsService: MembershipsService) {}

  public async updateMembershipStatus(
    user: JwtPayload,
    tenantId: string,
    membershipId: string,
    updateMembershipStatusDto: UpdateMembershipStatusDto,
  ) {
    return this.membershipsService.updateMembershipStatus(
      user,
      tenantId,
      membershipId,
      updateMembershipStatusDto,
    );
  }
}
