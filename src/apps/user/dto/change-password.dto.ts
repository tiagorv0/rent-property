import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, IsString } from 'class-validator';

export default class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Equals((value: string, obj: ChangePasswordDto) => obj.password)
  confirmPassword: string;
}
