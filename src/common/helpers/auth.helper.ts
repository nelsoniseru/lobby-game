import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

const logger = new Logger('AuthHelper');

export const hashPassword = async (password: string): Promise<string> => {
  logger.log('Hashing password');
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  logger.log('Comparing password');
  return bcrypt.compare(password, hash);
};

export const generateToken = (jwtService: JwtService, payload: any): string => {
  logger.log(`Generating JWT for user: ${payload.username}`);
  return jwtService.sign(payload);
};