import { IsEnum, IsNotEmpty } from 'class-validator';
import { MembershipRoleEnum } from '../../memberships/enums/membership-roles.enum.js';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(MembershipRoleEnum)
  role: MembershipRoleEnum;
}
