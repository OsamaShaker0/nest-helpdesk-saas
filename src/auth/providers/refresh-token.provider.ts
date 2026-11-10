import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { RefreshToken } from '../entities/refresh-token.entity.js';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from '../../users/users.service.js';
import { ConfigService } from '@nestjs/config';
import { RefreshTtokenDto } from '../dtos/refresh-token.dto.js';

const REFRESH_TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

@Injectable()
export class RefreshTokenProvider {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,

    private readonly usersService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  public async createRefreshToken(userId: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS); //FIXME:  fix that can not get the time from jwt;

    await this.refreshToken.save(
      this.refreshToken.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        revokedAt: null,
      }),
    );

    return { refreshToken: token, expiresAt };
  }
  public async revokeAllrefreshTokens(userId: string) {
    await this.refreshToken.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  public async refresh(refreshTtokenDto: RefreshTtokenDto) {
    const { refreshToken: token } = refreshTtokenDto;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const stored = await this.refreshToken.findOne({ where: { tokenHash } });
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //  reuse detection: token was already used
    if (stored.revokedAt) {
      await this.revokeAllrefreshTokens(stored.userId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    //  expired
    if (stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    //  revoke only this token
    const result = await this.refreshToken.update(
      { id: stored.id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
    if (result.affected !== 1) {
      throw new UnauthorizedException('Refresh token already used');
    }

    // issue a new refresh token
    const { refreshToken, expiresAt } = await this.createRefreshToken(
      stored.userId,
    );

    return { userId: stored.userId, refreshToken, expiresAt };
  }
}
