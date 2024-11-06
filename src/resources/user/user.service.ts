import { PhotoEntity, UserEntity } from '@common/database';
import { ICreateUser, IPhoto, IUser } from '@common/models';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,

    @InjectRepository(PhotoEntity)
    private readonly _photoRepository: Repository<PhotoEntity>,
  ) {}

  async findByLogin(login: string): Promise<UserEntity> {
    const user = await this._userRepository.findOneBy({ login });

    return user;
  }

  async findOne(param: Partial<IUser>): Promise<IUser> {
    const user = await this._userRepository.findOne({
      where: param,
      relations: ['photo'],
    });

    return user;
  }

  async create(body: ICreateUser): Promise<UserEntity> {
    const photo = await this._photoRepository.save({
      path: body.path,
    });

    const user = (await this._userRepository.save({
      firstName: body.firstName,
      patronymic: body.patronymic,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      phoneNumber: body.phoneNumber,
      email: body.email,
      login: body.login,
      password: body.password,
      photo: {
        id: photo.id,
      },
    })) as UserEntity;

    return user;
  }

  async remove(user: IUser): Promise<void> {
    try {
      await this._userRepository.remove(user);
      await this._photoRepository.delete(user.photo.id);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(
    user: IUser,
    updatedUser: ICreateUser,
    previousPhoto: IPhoto,
  ): Promise<void> {
    try {
      await this._photoRepository.update(previousPhoto.id, {
        path: updatedUser.path,
      });

      await this._userRepository.update(user.id, { firstName: updatedUser.firstName,
        patronymic: updatedUser.patronymic,
        lastName: updatedUser.lastName,
        dateOfBirth: updatedUser.dateOfBirth,
        phoneNumber: updatedUser.phoneNumber,
        email: updatedUser.email,
        login: updatedUser.login,
        password: updatedUser.password,
       })

    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
