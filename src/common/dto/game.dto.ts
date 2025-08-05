import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const JoinSessionDtoSchema = Joi.object({
  sessionId: Joi.string().required(),
  number: Joi.number().min(1).max(9).required(),
});

export const LeaveSessionDtoSchema = Joi.object({
  sessionId: Joi.string().required(),
});

export class JoinSessionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' })
  sessionId: string;

  @ApiProperty({ example: 5, description: 'The number chosen by the player (1-9)' })
  number: number;
}

export class LeaveSessionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' })
  sessionId: string;
}

export class GameSessionResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' })
  sessionId: string;

  @ApiProperty({ example: 'user123', description: 'The ID of the session creator' })
  creatorId: string;

  @ApiProperty({
    example: [{ userId: 'user123', number: null }, { userId: 'user456', number: 5 }],
    description: 'List of players in the session',
  })
  players: Array<{ userId: string; number: number | null }>;

  @ApiProperty({ example: 'active', description: 'Session status', enum: ['active', 'ended'] })
  status: 'active' | 'ended';

  @ApiProperty({ example: '2025-08-02T16:59:00.000Z', description: 'Session start time' })
  startTime: string;

  @ApiProperty({ example: 300000, description: 'Session duration in milliseconds' })
  duration: number;

  @ApiProperty({ example: 'session123', description: 'Internal session ID' })
  id: string;

  @ApiProperty({ example: 7, description: 'Winning number (if session ended)', required: false })
  winningNumber?: number;
}

export class LeaderboardResponse {
  @ApiProperty({
    example: [{ username: 'gameuser', wins: 5 }],
    description: 'List of top players with their win counts',
  })
  topPlayers: Array<{ username: string; wins: number }>;
}

export class SessionsByDateResponse {
  @ApiProperty({
    example: [
      {
        _id: '2025-08-02',
        sessions: [
          {
            sessionId: '123e4567-e89b-12d3-a456-426614174000',
            creatorId: 'user123',
            players: [{ userId: 'user123', number: null }, { userId: 'user456', number: 5 }],
            status: 'active',
            startTime: '2025-08-02T16:59:00.000Z',
            duration: 300000,
            id: 'session123',
          },
        ],
      },
    ],
    description: 'Sessions grouped by date in YYYY-MM-DD format',
  })
  sessions: Array<{
    _id: string;
    sessions: GameSessionResponse[];
  }>;
}