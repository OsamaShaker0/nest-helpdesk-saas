import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { AuthenticatedRequest } from '../../interfaces/request.interface.js';
import { MembershipsService } from '../../memberships/memberships.service.js';
import { TenantStatus } from '../../tenants/enums/tenant-status.enum.js';

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private readonly membershipsService: MembershipsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    const userId = request.user?.id;
    if (!userId) throw new UnauthorizedException();

    const tenantId = request.params.tenantId as string;
    if (!tenantId || !isUUID(tenantId)) {
      throw new BadRequestException('A valid tenantId is required');
    }

    // findActiveUserInTenant already filters on membership status = ACTIVE
    const membership = await this.membershipsService.findActiveUserInTenant(
      tenantId,
      userId,
    );
    if (!membership || membership.tenant.status !== TenantStatus.ACTIVE) {
      throw new ForbiddenException('No access to this tenant');
    }

    request.tenantContext = {
      userId,
      tenantId,
      membershipId: membership.id,
      role: membership.role,
    };
    return true;
  }
}
