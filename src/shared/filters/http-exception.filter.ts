import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import type { ErrorResponseBody } from '../contracts';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as string | { message?: unknown };
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = res.message;
        message = Array.isArray(msg) ? String(msg[0]) : String(msg);
      } else if (typeof res === 'string') {
        message = res;
      } else {
        message = typeof res === 'object' ? JSON.stringify(res) : String(res);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.warn(`${request.method} ${request.url} ${status} - ${message}`);

    const body: ErrorResponseBody = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
