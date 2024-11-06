import { Transform, Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsNotEmpty()
  patronymic: string;
  
  @IsString()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsPhoneNumber('RU', {message: 'Incorrect phone number for Russia'})
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsNotEmpty()
  login: string;

  @IsString()
  @Transform(({ value }) => {
    return value?.trim();
  })
  @IsNotEmpty()
  password: string;
}
