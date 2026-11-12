import { IsEnum, IsNotEmpty } from 'class-validator';
import { MembershipRoleEnum } from '../enums/membership-roles.enum.js';

export class UpdateMembershipRoleDto {
  @IsNotEmpty()
  @IsEnum(MembershipRoleEnum)
  role: MembershipRoleEnum;
}