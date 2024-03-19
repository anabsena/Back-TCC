import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  controllers: [PhotoController],
  providers: [PhotoService, PrismaService],
})
export class PhotoModule {}
