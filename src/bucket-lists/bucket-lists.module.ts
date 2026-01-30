import { Module } from '@nestjs/common';
import { BucketListsController } from './bucket-lists.controller';
import { BucketListsService } from './bucket-lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketList } from './entities/bucket-lists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BucketList])],
  controllers: [BucketListsController],
  providers: [BucketListsService],
})
export class BucketListsModule {}
