import { Request } from 'express';
import { MembershipRoleEnum } from '../memberships/enums/membership-roles.enum.js';

export interface JwtPayload {
  id: string;
  payload?: unknown;
  iat: number;
  exp: number;
}
interface TenantContext {
  userId: string;
  tenantId: string;
  membershipId: string;
  role: MembershipRoleEnum;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  tenantContext?: TenantContext;
}
