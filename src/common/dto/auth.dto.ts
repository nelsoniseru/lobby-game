import * as Joi from 'joi';

export const RegisterDtoSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const LoginDtoSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export interface RegisterDto {
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}