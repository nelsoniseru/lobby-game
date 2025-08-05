import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseFormat<T> {
  @ApiProperty({ example: true, description: 'Request status' })
  status: boolean;

  @ApiProperty({ description: 'Response data, including optional message and data payload' })
  data: { message?: string; data: T };

  static success<T>(statusCode: HttpStatus, data: T, message?: string): ResponseFormat<T> {
    return { status: true, data: { message, data } };
  }

  static error<T>(statusCode: HttpStatus, message: string, data: T = null as any): ResponseFormat<T> {
    return { status: false, data: { message, data } };
  }
}