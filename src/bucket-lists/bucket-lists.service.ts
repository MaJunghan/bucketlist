import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketList } from './entities/bucket-lists.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateBucketListDto } from './dto/create-bucket-list.dto';

@Injectable()
export class BucketListsService {
  constructor(
    @InjectRepository(BucketList)
    private readonly bucketListsRepository: Repository<BucketList>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    model: CreateBucketListDto,
  ): Promise<BucketList> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('유저를 찾지 못했습니다.');
    }

    const existingBucketList = await this.bucketListsRepository.findOne({
      where: {
        name: model.name,
        user: {
          id: userId,
        },
      },
    });

    if (existingBucketList) {
      throw new BadRequestException('이미 존재하는 버켓리스트 입니다.');
    }

    const newBucketList = await this.bucketListsRepository.create({
      ...model,
      user,
    });

    await this.bucketListsRepository.save(newBucketList);

    return newBucketList;
  }

  async findById(userId: string, id: number): Promise<BucketList> {
    const bucketList = await this.bucketListsRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!bucketList) {
      throw new NotFoundException('버킷리스트를 찾지 못했습니다.');
    }
    return bucketList;
  }

  async find(userId: string): Promise<BucketList | null> {
    return this.bucketListsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async remove(userId: string, id: number): Promise<void> {
    const bucketList = await this.findById(userId, id);
    await this.bucketListsRepository.remove(bucketList);
  }
}
