

import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const SubmitNumberDtoSchema = Joi.object({
  sessionId: Joi.string().required(),
  userId: Joi.string().required(),
  number: Joi.number().integer().min(1).max(9).required()
});

export class SubmitNumberDto {
  @ApiProperty({ example: 'abc123-session-id', description: 'ID of the active game session' })
  sessionId: string;

  @ApiProperty({ example: 'abc123-session-id', description: 'ID of the user' })
  userId: string;

  @ApiProperty({ example: 5, description: 'Number picked by the player (1-9)', minimum: 1, maximum: 9 })
  number: number;
}

export class SubmitNumberResponse {

  @ApiProperty({ example: 'Number chosen for session.', description: 'Response message after submission' })
  message: string;
}
