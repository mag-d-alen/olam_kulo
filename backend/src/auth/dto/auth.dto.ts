import { IsEmail, IsString, MinLength, IsOptional, IsObject } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

