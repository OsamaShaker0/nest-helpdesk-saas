import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    let { method, originalUrl } = req;
    const startDate = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const endDate = new Date().getTime();
      const duration = endDate - startDate;
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });
    next();
  }
}
