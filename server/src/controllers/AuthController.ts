import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { StaffService } from '../services/StaffService';
import { StaffRepository } from '../repositories/StaffRepositories';
import { HttpError } from '../middleware/errorHandler';

export class AuthController {
  private service = new AuthService();
  private staffService = new StaffService();
  private staffRepo = new StaffRepository();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.service.login(email, password);
    res.json(result);
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
      return res.status(201).json({ user: created, token });
    }
    return res.status(201).json({ user: created });
  };
}
