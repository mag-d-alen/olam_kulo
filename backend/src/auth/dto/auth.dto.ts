import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(320, { message: 'Email is too long (max 320 characters)' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password is too long (max 128 characters)' })
  @Matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message:
      'Password contains invalid characters. Only alphanumeric characters and common symbols are allowed.',
  })
  password!: string;
}

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(320, { message: 'Email is too long (max 320 characters)' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(128, { message: 'Password is too long (max 128 characters)' })
  @Matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message:
      'Password contains invalid characters. Only alphanumeric characters and common symbols are allowed.',
  })
  password!: string;
}

export class GetUserDto {
  @IsString()
  userId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  homeCity?: string;

  @IsString()
  destinationCity?: string;
}
