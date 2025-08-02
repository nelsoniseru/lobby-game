import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      this.logger.warn(`Validation failed: ${error.message}`);
      throw new BadRequestException('Validation failed');
    }
    this.logger.log('Validation passed');
    return value;
  }
}