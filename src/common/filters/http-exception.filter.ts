import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
 
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalHttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const method = request.method;
    const path = request.originalUrl;
    const timestamp = new Date().toISOString();
    let statusCode = 500;
    let message: string | string[] | object = 'internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = exceptionResponse.message;

        if (
          typeof responseMessage === 'string' ||
          Array.isArray(responseMessage)
        ) {
          message = responseMessage;
        }
      }
    }
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }
    const stackTrace =
      exception instanceof Error ? exception.stack : String(exception);
    if (!(exception instanceof HttpException)) {
      this.logger.error(`${method} ${path} - ${message}`, stackTrace);
    }

    return response.status(statusCode).json({
      statusCode,
      timestamp,
      path,
      method,
      message,
    });
  }
}
