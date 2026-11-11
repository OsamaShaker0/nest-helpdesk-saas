import { MembershipRoleEnum } from "../memberships/enums/membership-roles.enum.js";


export interface TenantContext {
  userId: string;
  tenantId: string;
  membershipId: string;
  role: MembershipRoleEnum;
}