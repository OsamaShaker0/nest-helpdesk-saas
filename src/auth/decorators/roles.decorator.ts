import { SetMetadata } from '@nestjs/common';
import { MembershipRoleEnum } from '../../memberships/enums/membership-roles.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MembershipRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
