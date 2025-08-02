import { HttpStatus } from '@nestjs/common';

export class ResponseFormat {
  static success(statusCode: number, data: any) {
    return {
      status: true,
      data,
    };
  }

  static error(statusCode: number, message: string, data: any = []) {
    return {
      status: false,
      data: { message, data },
    };
  }
}