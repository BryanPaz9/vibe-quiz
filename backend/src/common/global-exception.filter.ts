import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from './api-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const requestId =
      (request.id as string | undefined) ??
      request.headers['x-request-id']?.toString() ??
      crypto.randomUUID();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details: unknown[] = [];

    if (exception instanceof ApiError) {
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (status === 400) {
      code = 'VALIDATION_ERROR';
      message = 'Request validation failed';
      if (typeof payload === 'object' && payload && 'message' in payload) {
        const validation = (payload as { message: unknown }).message;
        details = Array.isArray(validation) ? validation : [validation];
      }
    } else if (exception instanceof HttpException) {
      code = HttpStatus[status] ?? 'HTTP_ERROR';
      message =
        typeof payload === 'string'
          ? payload
          : ((payload as { message?: string } | undefined)?.message ??
            exception.message);
    }

    response.status(status).json({
      error: {
        code,
        message,
        details,
        requestId,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
      },
    });
  }
}
