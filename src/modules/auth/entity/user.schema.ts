import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true }) 
export class User extends Document {
  @ApiProperty({ example: 'nelson123', description: 'Unique username' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ example: '••••••••', description: 'Hashed password', writeOnly: true })
  @Prop({ required: true }) 
  password: string;

  @ApiProperty({ example: 0, description: 'Number of wins by the user' })
  @Prop({ default: 0 })
  wins: number;
    @ApiProperty({ example: 0, description: 'Number of losses by the user' })
  @Prop({ default: 0 })
  loses: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
