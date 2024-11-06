import { PhotoEntity, UserEntity } from '@common/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PhotoEntity])],
  controllers: [UserController],
  providers: [UserService, FileService],
})
export class UserModule {}
