import { PipeTransform, Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as Joi from 'joi';
import { ResponseFormat } from '../responses/response.format';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      this.logger.warn(`Validation failed: ${error.message}`);
      console.log(error.message)
      throw new BadRequestException(ResponseFormat.error(HttpStatus.BAD_REQUEST, error.message));
    }
    this.logger.log('Validation passed');
    return value;
  }
}