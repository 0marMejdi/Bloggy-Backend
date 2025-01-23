import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class LoggingExceptionFilter extends BaseExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    console.log('went through filter');

    console.log(exception.stack);

    return super.catch(exception, host);
  }
}
