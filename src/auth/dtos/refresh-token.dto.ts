import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTtokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
