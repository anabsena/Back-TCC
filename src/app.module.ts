import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/project-module/projects/project.module';
import { UserModule } from './modules/user-module/user.module';
import { CategoryModule } from './modules/project-module/project-category/category.module';
import { PhotoModule } from './modules/project-module/project-photo/photo.module';
import { AuthModule } from './modules/auth-modules/auth/auth-module';

@Module({
  imports: [AuthModule, ProjectModule, UserModule, CategoryModule, PhotoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
