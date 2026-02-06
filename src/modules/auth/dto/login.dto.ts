import { IsString, IsNotEmpty } from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsNotEmpty()
  secret: string;
}
