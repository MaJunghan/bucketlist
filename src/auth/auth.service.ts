import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import argon2 from 'argon2';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // signUp
  async signUp(data: SignUpDto): Promise<any> {
    // 기존 유저가 있는지 확인
    const existUser = await this.usersService.findByUsername(data.username);
    if (existUser) {
      throw new BadRequestException(
        `${data.username}으로 이미지 가입된 계정이 있습니다.`,
      );
    }
    // 비밀번호 해싱
    const hashedPassword = await this.hashFn(data.password);
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    // user대신 token
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  // signIn
  async signIn(data: SignInDto): Promise<any> {
    const user = await this.usersService.findByUsername(data.username);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordMatched = await argon2.verify(user.password, data.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // signOut
  async signOut(userId: string) {
    await this.usersService.update(userId, {
      refreshToken: undefined,
    });
  }

  // 리프레시 토큰 갱신
  async refreshAllTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('refresh token이 존재하지 않습니다.');
    }

    const isRefreshTokenMatched = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatched) {
      throw new ForbiddenException('refresh token이 일치하지 않습니다.');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // 비밀번호 해싱
  private hashFn(data: string): Promise<string> {
    return argon2.hash(data);
  }

  //  리프레시 토큰 업데이트
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashFn(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // token 생성
  private async getTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
