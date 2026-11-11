import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserToTenantDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
