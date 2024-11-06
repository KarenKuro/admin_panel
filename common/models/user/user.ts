import { IPhoto } from '../photo';

export interface IUser {
  id: number;
  firstName: string;
  patronymic: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  login: string;
  password: string;
  photo: IPhoto;
  createdAt: Date;
  updatedAt: Date;
}
