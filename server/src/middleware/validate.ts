import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from './errorHandler';

export function validateBody<T>(dto: ClassConstructor<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(dto, req.body, { enableImplicitConversion: true });
    const errors = await validate(instance as any, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new HttpError(400, 'Validation failed', 'VALIDATION_ERROR', errors);
    }
    // attach parsed DTO for downstream usage
    (req as any).dto = instance;
    next();
  };
}
