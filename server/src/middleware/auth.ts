import { NextFunction, Request, Response } from 'express';
import { HttpError } from './errorHandler';
import { verify } from 'jsonwebtoken';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

function getAuthHeaderToken(req: Request) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.substring(7);
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getAuthHeaderToken(req);
  if (!token) throw new HttpError(401, 'Unauthorized');
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'changeme') as AuthUser & { iat: number; exp: number };
    (req as any).user = { id: decoded.id, email: decoded.email, role: decoded.role } as AuthUser;
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

export function requireRoles(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) throw new HttpError(401, 'Unauthorized');
    if (!roles.includes(user.role)) throw new HttpError(403, 'Forbidden');
    next();
  };
}

export function getUser(req: Request): AuthUser | undefined {
  return (req as any).user as AuthUser | undefined;
}
