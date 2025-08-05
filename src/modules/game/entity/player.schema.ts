import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Player extends Document {
  @ApiProperty({ example: 'user123', description: 'The ID of the player' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ example: 5, description: 'Number chosen by player (1–9)', nullable: true })
  @Prop({ type: Number, required: false, default: null })
  number: number | null;

  @ApiProperty({ example: 'session-abc-123', description: 'Associated session ID' })
  @Prop({ required: true })
  sessionId: string;
  
  @ApiProperty({ example: false, description: 'Whether the player is soft-deleted' })
  @Prop({ default: false })
  deleted: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
