import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { StaffService } from '../services/StaffService';
import { StaffRepository } from '../repositories/StaffRepositories';
import { HttpError } from '../middleware/errorHandler';
import { RevokedTokenRepository } from '../repositories/AuthRepositories';
import { getAuthHeaderToken } from '../middleware/auth';

export class AuthController {
  private service = new AuthService();
  private staffService = new StaffService();
  private staffRepo = new StaffRepository();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.service.login(email, password);
    // Set token in an HttpOnly cookie instead of returning it for client-side storage
    const token = (result as any).token as string | undefined;
    if (token) {
      try {
        const decoded = await import('jsonwebtoken');
        const d = decoded.decode(token) as any;
        const maxAge = d && d.exp && d.iat ? (d.exp - d.iat) * 1000 : undefined;
        const cookieOpts: any = { httpOnly: true, sameSite: 'lax', path: '/' };
        if (process.env.NODE_ENV === 'production') cookieOpts.secure = true;
        if (maxAge) cookieOpts.maxAge = maxAge;
        res.cookie('token', token, cookieOpts);
      } catch (e) {
        // ignore cookie set failure and continue returning token body as fallback
      }
    }
    // Return only user object; token is set as HttpOnly cookie
    return res.json({ user: (result as any).user });
  };

  me = async (req: Request, res: Response) => {
    const user = (req as any).user as { id: string };
    const staff = await this.staffRepo.findById(user.id);
    if (!staff) return res.status(404).json({ error: 'Not found' });
    const { passwordHash, ...safe } = staff as any;
    res.json({ user: safe });
  };

  // Registration rules:
  // - If no staff users exist yet, allow public registration (bootstrap) and default role from body (recommended Admin)
  // - If staff exists, require authenticated Admin to register new users
  register = async (req: Request, res: Response) => {
    const total = await this.staffRepo.count();
    const user = (req as any).user as { role?: string } | undefined;
    if (total > 0) {
      if (!user || user.role !== 'Admin') {
        throw new HttpError(403, 'Only Admin can register new users');
      }
    }
    const input = req.body as any;
    const created = await this.staffService.createStaff(input);
    // convenience: issue token if self-bootstrapped (no users before)
    if (total === 0) {
      const token = this.service.issueToken({ id: created.id, email: created.email, role: created.role });
      // set cookie like login
      try {
        const decoded = await import('jsonwebtoken');
        const d = decoded.decode(token) as any;
        const maxAge = d && d.exp && d.iat ? (d.exp - d.iat) * 1000 : undefined;
        const cookieOpts: any = { httpOnly: true, sameSite: 'lax', path: '/' };
        if (process.env.NODE_ENV === 'production') cookieOpts.secure = true;
        if (maxAge) cookieOpts.maxAge = maxAge;
        (res as any).cookie('token', token, cookieOpts);
      } catch (e) {}
      return res.status(201).json({ user: created });
    }
    return res.status(201).json({ user: created });
  };

  logout = async (req: Request, res: Response) => {
    const token = getAuthHeaderToken(req);
    if (!token) throw new HttpError(400, 'No token provided');
    // requireAuth middleware should have validated token already; just store it as revoked
    const repo = new RevokedTokenRepository();
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.decode(token) as any;
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
    const rec = repo.create({ token, expiresAt } as any);
    await repo.save(rec as any);
    // clear cookie
    res.clearCookie('token', { path: '/' });
    return res.json({ success: true });
  };
}
