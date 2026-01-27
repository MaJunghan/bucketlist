import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { Request } from 'express';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/common/guard/access-token.guerd';
import { UpdateUserDto } from './dto/update-user-dto';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    refreshToken?: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET user info
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.shieldUserInformation(user);
  }

  // PUT user
  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(req.user['sub'], updateUserDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.shieldUserInformation(user);
  }

  private shieldUserInformation(user: User) {
    return { ...user, password: undefined, refreshToken: undefined };
  }
}
