import { IsNotEmpty, IsNumberString } from "class-validator";

export class IdDTO {
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}
