import { JwtService } from '@nestjs/jwt';
import { RefreshTokenProvider } from './refresh-token.provider.js';
import { RefreshTtokenDto } from '../dtos/refresh-token.dto.js';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtProvider {
  private readonly logger = new Logger(JwtProvider.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signInToken<T>(userId: string, payload?: T) {
    const accessToken = this.jwtService.sign({ id: userId, payload });

    await this.refreshTokenProvider.revokeAllrefreshTokens(userId);
    const { refreshToken } =
      await this.refreshTokenProvider.createRefreshToken(userId);

    return { accessToken, refreshToken };
  }
  public signAccessToken<T>(userId: string, payload?: T) {
    return this.jwtService.sign({ id: userId, payload });
  }

  public async refreshTokens(dto: RefreshTtokenDto) {
    const { userId, refreshToken } =
      await this.refreshTokenProvider.refresh(dto);
    const accessToken = this.jwtService.sign({ id: userId });
    return { accessToken, refreshToken };
  }
}
