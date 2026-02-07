import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';

function colorStatus(status: number): string {
  if (status >= 500) {
    return `${RED}${status}${RESET}`;
  }
  if (status >= 400) {
    return `${YELLOW}${status}${RESET}`;
  }
  if (status >= 300) {
    return `${CYAN}${status}${RESET}`;
  }
  return `${GREEN}${status}${RESET}`;
}

export function httpRequestLogger(_req: Request, res: Response, next: NextFunction): void {
  const logger = new Logger('HTTP');
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = _req.method;
    const url = _req.originalUrl ?? _req.url;
    const status = res.statusCode;
    const statusStr = colorStatus(status);
    const durationStr = `${DIM}${duration}ms${RESET}`;
    logger.log(`${method} ${url} ${statusStr} ${durationStr}`);
  });

  next();
}
