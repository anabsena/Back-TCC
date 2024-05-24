import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { ConfigModule } from '@nestjs/config';
import variables from 'src/variables';
import { StorageService } from 'src/services/storage.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [variables],
    }),
  ],
  controllers: [PhotoController],
  providers: [PhotoService, PrismaService, StorageService],
})
export class PhotoModule { }
