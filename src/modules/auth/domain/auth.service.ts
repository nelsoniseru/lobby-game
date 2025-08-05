import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from '../../user/adapters/ports/user.repository';
import { RegisterDto, LoginDto } from '../../../common/dto/auth.dto';
import { hashPassword, comparePassword, generateToken } from '../../../common/helpers/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userRepository.findByUsername(dto.username);
    if (user) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    const hashed = await hashPassword(dto.password); // 🔁 Using helper
    const newUser = await this.userRepository.create({
      username: dto.username,
      password: hashed,
    });

    const token = generateToken(this.jwtService, {
      id: newUser.id,
      username: newUser.username,
    });

    return { token };
  }

async login(dto: LoginDto) {
console.log(dto)
  const user = await this.userRepository.findByUsername(dto.username);
  if (!user) {
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const isValid = await comparePassword(dto.password, user.password);
  if (!isValid) {
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const token = generateToken(this.jwtService, {
    id: user.id,
    username: user.username,
  });

  return { token };
}
async me(id:string){
   const user = await this.userRepository.find(id);
  return user
}
}
