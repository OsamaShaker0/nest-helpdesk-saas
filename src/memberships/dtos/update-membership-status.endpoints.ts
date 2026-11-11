import { IsEnum, IsNotEmpty } from 'class-validator';
import { MembershipStatusEnum } from '../enums/membership-status.enum.js';

export class UpdateMembershipStatusDto {
  @IsNotEmpty()
  @IsEnum(MembershipStatusEnum)
  status: MembershipStatusEnum;
}
