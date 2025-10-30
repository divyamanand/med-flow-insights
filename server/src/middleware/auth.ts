import { NextFunction, Request, Response } from 'express';
import { HttpError } from './errorHandler';
import { verify } from 'jsonwebtoken';
import { RevokedTokenRepository } from '../repositories/AuthRepositories';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export function getAuthHeaderToken(req: Request) {
  // Prefer Authorization header Bearer <token>
  const header = req.headers['authorization'];
  if (header && header.startsWith('Bearer ')) return header.substring(7);

  // Fallback to cookie named 'token' if present: parse simple cookie header
  const cookieHeader = req.headers['cookie'];
  if (!cookieHeader || typeof cookieHeader !== 'string') return null;
  const parts = cookieHeader.split(';').map(p => p.trim());
  for (const p of parts) {
    if (!p) continue;
    const [k, ...vs] = p.split('=');
    if (k === 'token') return vs.join('=');
  }
  return null;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getAuthHeaderToken(req);
  if (!token) throw new HttpError(401, 'Unauthorized');
  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'changeme') as AuthUser & { iat: number; exp: number };
    // check revoked list
    const repo = new RevokedTokenRepository();
    const revoked = await repo.findOne({ where: { token } });
    if (revoked) throw new HttpError(401, 'Token revoked');
    (req as any).user = { id: decoded.id, email: decoded.email, role: decoded.role } as AuthUser;
    next();
  } catch (err) {
    // If it's our HttpError, rethrow, else map to generic
    if (err instanceof HttpError) throw err;
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
