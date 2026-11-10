
import { Request } from 'express';

export interface JwtPayload {
  id: string;
  payload?: unknown;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}