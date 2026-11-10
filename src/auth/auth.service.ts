import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { UsersService } from '../users/users.service.js';
import { HashingProvider } from './providers/hashing.provider.js';
import { CreateUserDto } from '../users/dtos/create-user.dto.js';
import { LogInUserDto } from './dtos/login-user.dto.js';
import { JwtProvider } from './providers/jwt.provider.js';
import { RefreshTokenProvider } from './providers/refresh-token.provider.js';

import { RefreshTtokenDto } from './dtos/refresh-token.dto.js';
import { LogoutDto } from './dtos/logout.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly jwtProvider: JwtProvider,

    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}
  public async registerUser(registerDto: RegisterDto) {
    let user = await this.usersService.findUserByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    let hashedPassword = await this.hashingProvider.hashPassword(
      registerDto.password,
    );
    let createUserDto: CreateUserDto = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      passwordHash: hashedPassword,
    };
    user = await this.usersService.createUser(createUserDto);
    return user;
  }
  public async loginUser(logInUserDto: LogInUserDto) {
    let user = await this.usersService.findUserByEmail(logInUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credential');
    }
    let match = await this.hashingProvider.comparePassword(
      logInUserDto.password,
      user.passwordHash,
    );
    if (!match) {
      throw new UnauthorizedException('Invalid Credential');
    }
    await this.refreshTokenProvider.revokeAllrefreshTokens(user.id);
    let tokens = await this.jwtProvider.signInToken(user.id);

    return { tokens };
  }
  async createNewRefreshTokens(refreshTtokenDto: RefreshTtokenDto) {
    const { userId, refreshToken } =
      await this.refreshTokenProvider.refresh(refreshTtokenDto);
    const accessToken = this.jwtProvider.signAccessToken(userId);
    return { accessToken, refreshToken };
  }
  public async logout(id:string) {
    
    await this.refreshTokenProvider.revokeAllrefreshTokens(id);

    return { message: 'Logged out successfully' };
  }
}
