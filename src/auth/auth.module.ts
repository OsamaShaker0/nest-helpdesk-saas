import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { HashingProvider } from './providers/hashing.provider.js';
import { BcryptProvider } from './providers/bcrypt.provider.js';
import { UsersModule } from '../users/users.module.js';
import { JwtProvider } from './providers/jwt.provider.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { RefreshTokenProvider } from './providers/refresh-token.provider.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    MembershipsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    JwtProvider,
    RefreshTokenProvider,
  ],
})
export class AuthModule {}
