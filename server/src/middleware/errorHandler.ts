import { NextFunction, Request, Response } from 'express';
import { fail } from '../utils/response';

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  const code = err?.code;
  const details = err?.details || (process.env.NODE_ENV !== 'production' ? err?.stack : undefined);
  res.status(status).json(fail(message, code, details));
}
