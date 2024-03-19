import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/project-module/projects/project.module';
import { UserModule } from './modules/user-module/user.module';

@Module({
  imports: [ProjectModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
