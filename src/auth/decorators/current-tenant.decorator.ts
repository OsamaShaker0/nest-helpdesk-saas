// src/common/decorators/current-tenant.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../interfaces/request.interface.js';
import { TenantContext } from '../../interfaces/tenantContext.interface.js';

export const CurrentTenant = createParamDecorator(
  (data: keyof TenantContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const tenantContext = request.tenantContext;

    if (!tenantContext) {
      throw new InternalServerErrorException(
        'Tenant context is missing. Is TenantContextGuard applied?',
      );
    }

    return data ? tenantContext[data] : tenantContext;
  },
);
