import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from '../../user/ports/user.repository'; // Use import type for UserRepository
import { RegisterDto, LoginDto } from '../../../common/dto/auth.dto';
import { hashPassword, comparePassword, generateToken } from '../../../common/helpers/auth.helper';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registering user: ${dto.username}`);
    const user = await this.userRepository.findByUsername(dto.username);
    if (user) {
      this.logger.warn(`Username already exists: ${dto.username}`);
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await hashPassword(dto.password);
    const newUser = await this.userRepository.create({
      username: dto.username,
      password: hashedPassword,
      wins: 0,
    });
    this.logger.log(`User registered successfully: ${newUser.username}`);
    return { token: generateToken(this.jwtService, { id: newUser.id, username: newUser.username }) };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Logging in user: ${dto.username}`);
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user || !(await comparePassword(dto.password, user.password))) {
      this.logger.warn(`Invalid credentials for user: ${dto.username}`);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`User logged in successfully: ${user.username}`);
    return { token: generateToken(this.jwtService, { id: user.id, username: user.username }) };
  }
}