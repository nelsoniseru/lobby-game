import { Controller, Post, Body, Get, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { RegisterDtoSchema, LoginDtoSchema, RegisterDto, LoginDto, LoginResponse, UserResponseDto } from '../../../common/dto/auth.dto';
import type { RegisterDto as RegisterDtoType, LoginDto as LoginDtoType } from '../../../common/dto/auth.dto';
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { ResponseFormat } from '../../../common/responses/response.format';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

export class StandardResponse<T> {
  @ApiProperty({ example: true, description: 'Request status' })
  status: boolean;

  @ApiProperty({ description: 'Response data' })
  data: {
    message?: string;
    data: T;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: StandardResponse<LoginResponse> })
  @ApiResponse({ status: 400, description: 'Invalid input', type: StandardResponse<null> })
  async register(@Body(new JoiValidationPipe(RegisterDtoSchema)) dto: RegisterDtoType) {
    this.logger.log(`Received register request for username: ${dto.username}`);
    try {
      const result = await this.authService.register(dto);
      this.logger.log(`Registration successful for username: ${dto.username}`);
      return ResponseFormat.success(HttpStatus.CREATED, { token: result.token }, 'Registration successful');
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: StandardResponse<LoginResponse> })
  @ApiResponse({ status: 401, description: 'Invalid credentials', type: StandardResponse<null> })
  async login(@Body(new JoiValidationPipe(LoginDtoSchema)) dto: LoginDtoType) {
    this.logger.log(`Received login request for username: ${dto.username}`);
    try {
      const result = await this.authService.login(dto);
      this.logger.log(`Login successful for username: ${dto.username}`);
      return ResponseFormat.success(HttpStatus.OK, { token: result.token }, 'Login successful');
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      return ResponseFormat.error(HttpStatus.UNAUTHORIZED, error.message);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get currently authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns user details', type: StandardResponse<UserResponseDto> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async getUserDetails(@Request() req) {
    const userId = req.user.id;
    const user = await this.authService.me(userId);
    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      return ResponseFormat.error(HttpStatus.NOT_FOUND, 'User not found');
    }
    this.logger.log(`User details retrieved for user: ${userId}`);
    return ResponseFormat.success(HttpStatus.OK, { user }, 'User details retrieved');
  }
}