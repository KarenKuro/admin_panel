import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDTO, IdDTO, SuccessDTO, UserResponseDTO } from './dto';
import { Folder } from '@common/enums';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() body: CreateUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /.(jpg|jpeg|png|xml)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1000 * 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ): Promise<SuccessDTO> {
    const existUser = await this._userService.findByLogin(body.login);

    if (existUser) {
      throw new ConflictException('User with that login already exist');
    }

    const filePath = await this._fileService.saveFile(file, Folder.PHOTO);

    const user = await this._userService.create({
      ...body,
      path: filePath,
    });

    if (!user) {
      return { success: false };
    }

    return { success: true };
  }

  @Get(':id')
  async findOne(@Param() param: IdDTO): Promise<UserResponseDTO> {
    const user = await this._userService.findOne({ id: +param.id });

    if (!user) {
      throw new NotFoundException(`User with id ${param.id} not found`);
    }

    return user;
  }

  @Delete(':id')
  async remove(@Param() param: IdDTO): Promise<SuccessDTO> {
    const user = await this._userService.findOne({ id: +param.id });

    if (!user) {
      throw new NotFoundException(`User with id ${param.id} not found`);
    }

    await this._userService.remove(user);

    await this._fileService.removeFile(user.photo.path);

    return { success: true };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param() param: IdDTO,
    @Body() body: CreateUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /.(jpg|jpeg|png|xml)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1000 * 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ): Promise<SuccessDTO> {
    const user = await this._userService.findOne({ id: +param.id });

    if (!user) {
      throw new NotFoundException(`User with id ${param.id} not found`);
    }

    const previousPhoto = user.photo;

    await this._fileService.removeFile(previousPhoto.path);

    const newFilePath = await this._fileService.saveFile(file, Folder.PHOTO);
    const updatedUser = { ...body, path: newFilePath };

    await this._userService.update(user, updatedUser, previousPhoto);

    return { success: true };
  }
}
