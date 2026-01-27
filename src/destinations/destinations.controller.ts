import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationsDto } from './dto/create-destinations.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  // 2.	**여행지 등록 API** - 새로운 여행지 등록 API 구현 (POST /destinations)
  @Post('')
  async createDestination(@Body() body: CreateDestinationsDto) {
    return this.destinationsService.create(body);
  }

  // 3.	**여행지 목록 조회 API** - 모든 여행지 목록을 조회하는 API 구현 (GET /destinations)
  @Get('')
  async findAllDestinations() {
    return this.destinationsService.findAll();
  }

  // 4.	**여행지 상세 조회 API** - 특정 여행지의 세부 정보를 조회하는 API 구현 (GET /destinations/:id)
  @Get(':id')
  async findDestinationById(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.findById(id);
  }

  // 5.	**여행지 삭제 API** - 특정 여행지 삭제 API 구현 (DELETE /destinations/:id)
  @Delete(':id')
  async removeDestination(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.remove(id);
  }
}
