import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guerd';
import type { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guerd';


interface RequestWithUser extends Request {
  user: {
    sub: string;
    refreshToken?: string;
  };
}


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() SignUpDto: SignUpDto) {
    return this.authService.signUp(SignUpDto);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signOut(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    this.authService.signOut(userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshAllTokens(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'] as string

    return this.authService.refreshAllTokens(userId, refreshToken)
  }

}
