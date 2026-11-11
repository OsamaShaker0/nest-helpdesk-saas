import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAdminInTenant {
  @IsUUID()
  @IsNotEmpty()
  adminId: string;
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
