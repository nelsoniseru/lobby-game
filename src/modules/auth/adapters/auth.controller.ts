import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { RegisterDtoSchema, LoginDtoSchema } from '../../../common/dto/auth.dto';
import type { RegisterDto, LoginDto } from '../../../common/dto/auth.dto'; // Use import type for DTOs
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { ResponseFormat } from '../../../common/responses/response.format';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new JoiValidationPipe(RegisterDtoSchema)) dto: RegisterDto) {
    this.logger.log(`Received register request for username: ${dto.username}`);
    try {
      const result = await this.authService.register(dto);
      this.logger.log(`Registration successful for username: ${dto.username}`);
      return ResponseFormat.success(HttpStatus.CREATED, { token: result.token });
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  @Post('login')
  async login(@Body(new JoiValidationPipe(LoginDtoSchema)) dto: LoginDto) {
    this.logger.log(`Received login request for username: ${dto.username}`);
    try {
      const result = await this.authService.login(dto);
      this.logger.log(`Login successful for username: ${dto.username}`);
      return ResponseFormat.success(HttpStatus.OK, { token: result.token });
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }
}