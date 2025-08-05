import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const RegisterDtoSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const LoginDtoSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export class RegisterDto {
  @ApiProperty({ example: 'gameuser', description: 'The username for registration', minLength: 3, maxLength: 30 })
  username: string;

  @ApiProperty({ example: 'password123', description: 'The password for registration', minLength: 6 })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'gameuser', description: 'The username for login' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'The password for login' })
  password: string;
}

export class LoginResponse {
  @ApiProperty({ example: 'jwt_token_here', description: 'JWT token for authentication' })
  token: string;
}


export class UserResponseDto {
  @ApiProperty({ example: 'gameuser', description: 'The username of the authenticated user' })
  username: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique identifier of the user' })
  id: string;
}