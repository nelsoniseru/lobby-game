import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema({ timestamps: true })
export class GameSession extends Document {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique session ID' })
  @Prop({ required: true, unique: true })
  sessionId: string;

  @ApiProperty({ example: 'active', description: 'Session status', enum: ['active', 'ended'] })
  @Prop({ required: true, enum: ['active', 'ended'] })
  status: 'active' | 'ended';

  @ApiProperty({ example: '2025-08-02T16:59:00.000Z', description: 'Session start time (ISO format)' })
  @Prop({ required: true })
  startTime: string;

  @ApiProperty({ example: 300000, description: 'Session duration in milliseconds' })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({ example: 7, description: 'Winning number (if session ended)', required: false })
  @Prop({ type: Number, required: false })
  winningNumber?: number;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);