import { FileHelpers } from "@common/helpers";
import { IPhoto } from "@common/models";
import { Transform } from "class-transformer";

export class UserResponseDTO {
  firstName: string;
  patronymic: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  login: string;
  password: string;
  @Transform(({value}) => {
    return FileHelpers.generatePath(value.path)
  })
  photo: IPhoto;
}
