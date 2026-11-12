import { Request } from 'express';
import { TenantContext } from './tenantContext.interface.js';

export interface JwtPayload {
  id: string;
  payload?: unknown;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  tenantContext?: TenantContext;
}
