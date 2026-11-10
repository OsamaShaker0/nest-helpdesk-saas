import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(254)
  email: string;
  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}
