import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../../interfaces/request.interface.js';
import { MembershipRoleEnum } from '../../memberships/enums/membership-roles.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      MembershipRoleEnum[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tenantContext = request.tenantContext;
    if (!tenantContext) {
      throw new InternalServerErrorException(
        'Tenant context is missing. Apply TenantContextGuard before RolesGuard.',
      );
    }

    if (!requiredRoles.includes(tenantContext.role)) {
      throw new ForbiddenException('Insufficient role for this action');
    }
    return true;
  }
}
