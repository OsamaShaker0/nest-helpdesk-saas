import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dtos/register.dto.js';
import { LogInUserDto } from './dtos/login-user.dto.js';
import { RefreshTtokenDto } from './dtos/refresh-token.dto.js';
import { LogoutDto } from './dtos/logout.dto.js';
import { Public } from './decorators/public.decorator.js';
import type { AuthenticatedRequest } from '../interfaces/request.interface.js';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
  @Public()
  @Post('login')
  public logIn(@Body() logInUserDto: LogInUserDto) {
    return this.authService.loginUser(logInUserDto);
  }
  @Public()
  @Post('refresh-token')
  public createAccessAndRefreshToken(
    @Body() refreshTtokenDto: RefreshTtokenDto,
  ) {
    return this.authService.createNewRefreshTokens(refreshTtokenDto);
  }
  @Post('logout')
  @HttpCode(200)
  public logout(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.authService.logout(req.user?.id);
  }
}
