import { Controller, Post, Body, Get, HttpStatus, Request, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { GameService } from '../domain/game.service';
import { JwtAuthGuard } from '../../auth/adapters/jwt-auth.guard';
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { ResponseFormat } from '../../../common/responses/response.format';
import {
  JoinSessionDtoSchema,
  LeaveSessionDtoSchema,
  JoinSessionDto,
  LeaveSessionDto,
  GameSessionResponse,
  LeaderboardResponse,
  SessionsByDateResponse,
} from '../../../common/dto/game.dto';
import type { JoinSessionDto as JoinSessionDtoType, LeaveSessionDto as LeaveSessionDtoType } from '../../../common/dto/game.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { SubmitNumberDto, SubmitNumberDtoSchema, SubmitNumberResponse } from 'src/common/dto/submitNumber.dto';

export class StandardResponse<T> {
  @ApiProperty({ example: true, description: 'Request status' })
  status: boolean;

  @ApiProperty({ description: 'Response data' })
  data: {
    message?: string;
    data: T;
  };
}

@ApiTags('game')
@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) { }

  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start a new game session' })
  @ApiResponse({ status: 201, description: 'Session started successfully', type: StandardResponse<GameSessionResponse> })
  @ApiResponse({ status: 400, description: 'User already in an active session', type: StandardResponse<null> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async startSession(@Request() req) {
    this.logger.log(`User ${req.user.id} starting new session`);
    try {
      const session = await this.gameService.startSession();
      this.logger.log(`Session started: ${session.sessionId}`);
      return ResponseFormat.success(HttpStatus.CREATED, { session });
    } catch (error) {
      this.logger.error(`Failed to start session: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  @Post('join')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Join an existing game session' })
  @ApiBody({ type: JoinSessionDto })
  @ApiResponse({ status: 200, description: 'Session joined successfully', type: StandardResponse<GameSessionResponse> })
  @ApiResponse({ status: 400, description: 'Session not active or user already in session', type: StandardResponse<null> })
  @ApiResponse({ status: 404, description: 'Session not found', type: StandardResponse<null> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async joinSession(@Request() req, @Body(new JoiValidationPipe(JoinSessionDtoSchema)) dto: JoinSessionDtoType) {
    this.logger.log(`User ${req.user.id} joining session: ${dto.sessionId}`);
    try {
      const session = await this.gameService.joinSession(dto.sessionId, req.user.id);
      this.logger.log(`User ${req.user.id} joined session: ${dto.sessionId}`);
      return ResponseFormat.success(HttpStatus.OK, { session });
    } catch (error) {
      this.logger.error(`Failed to join session: ${error.message}`);
      return ResponseFormat.error(error.status || HttpStatus.BAD_REQUEST, error.message);
    }
  }

  @Post('leave')
  @ApiOperation({ summary: 'Leave a game session' })
  @ApiBody({ type: LeaveSessionDto })
  @ApiResponse({ status: 200, description: 'Session left successfully', type: StandardResponse<GameSessionResponse> })
  @ApiResponse({ status: 400, description: 'Session not active', type: StandardResponse<null> })
  @ApiResponse({ status: 404, description: 'Session not found', type: StandardResponse<null> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async leaveSession(@Request() req, @Body(new JoiValidationPipe(LeaveSessionDtoSchema)) body: LeaveSessionDtoType) {
    this.logger.log(`User ${req.user.id} leaving session: ${body.sessionId}`);
    try {
      const session = await this.gameService.leaveSession(body.sessionId, req.user.id);
      this.logger.log(`User ${req.user.id} left session: ${body.sessionId}`);
      return ResponseFormat.success(HttpStatus.OK, { session });
    } catch (error) {
      this.logger.error(`Failed to leave session: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }


  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top players leaderboard' })
  @ApiQuery({
    name: 'filter',
    required: false,
    enum: ['all', 'day', 'week', 'month'],
    description: 'Filter by time period (default: all)'
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: StandardResponse<LeaderboardResponse>
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid filter parameter',
    type: StandardResponse<null>
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: StandardResponse<null>
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: StandardResponse<null>
  })
  async getLeaderboard(@Query('filter') filter: string = 'all') {
    this.logger.log(`Fetching leaderboard with filter: ${filter}`);

    const validFilters = ['all', 'day', 'week', 'month'];
    if (filter && !validFilters.includes(filter)) {
      this.logger.warn(`Invalid filter parameter: ${filter}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, 'Invalid filter parameter. Use: all, day, week, month');
    }

    try {
      const topPlayers = await this.gameService.getTopPlayers(10, filter);
      console.log(topPlayers)
      this.logger.log('Leaderboard fetched successfully');
      return ResponseFormat.success(HttpStatus.OK, { topPlayers }, 'Leaderboard retrieved successfully');
    } catch (error) {
      this.logger.error(`Failed to fetch leaderboard: ${error.message}`);
      return ResponseFormat.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch leaderboard');
    }
  }


  @Get('sessions-by-date')
  @ApiOperation({ summary: 'Get sessions grouped by date' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully', type: StandardResponse<SessionsByDateResponse> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async getSessionsByDate() {
    this.logger.log('Fetching sessions by date');
    try {
      const sessions = await this.gameService.getSessionsByDate();
      this.logger.log('Sessions by date fetched successfully');
      return ResponseFormat.success(HttpStatus.OK, { sessions });
    } catch (error) {
      this.logger.error(`Failed to fetch sessions by date: ${error.message}`);
      return ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  @Post('choose-number')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a number for a session by a user' })
  @ApiBody({ type: SubmitNumberDto })
  @ApiResponse({ status: 200, description: 'Number submitted successfully', type: StandardResponse<SubmitNumberResponse> })
  @ApiResponse({ status: 400, description: 'Invalid input or submission error', type: StandardResponse<null> })
  @ApiResponse({ status: 404, description: 'Session or user not found', type: StandardResponse<null> })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: StandardResponse<null> })
  async submitNumber(
    @Request() req,
    @Body(new JoiValidationPipe(SubmitNumberDtoSchema)) dto: SubmitNumberDto
  ) {
    this.logger.log(`User ${req.user.id} submitting number ${dto.number} for session ${dto.sessionId}`);
    try {
      const result = await this.gameService.submitPlayerNumber(dto.sessionId, req.user.id, dto.number);
      this.logger.log(`Submission success for user ${req.user.id} in session ${dto.sessionId}`);
      return ResponseFormat.success(HttpStatus.OK, { result });
    } catch (error) {
      this.logger.error(`Failed to submit number: ${error.message}`);
      return ResponseFormat.error(error.status || HttpStatus.BAD_REQUEST, error.message);
    }
  }

}