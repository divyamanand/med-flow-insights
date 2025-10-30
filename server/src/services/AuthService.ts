import { StaffRepository } from '../repositories/StaffRepositories';
import { sign, type Secret, type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  private staffRepo = new StaffRepository();

  async login(email: string, password: string) {
    const staff = await this.staffRepo.findAuthByEmail(email);
    if (!staff || !staff.passwordHash) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, staff.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = this.issueToken({ id: staff.id, email: staff.email, role: staff.role });
    return { token, user: { id: staff.id, email: staff.email, role: staff.role, firstName: (staff as any).firstName, lastName: (staff as any).lastName } };
  }

  issueToken(payload: { id: string; email: string; role: string }) {
    const secret: Secret = process.env.JWT_SECRET || 'changeme';
    const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any };
    return sign(payload, secret, options);
  }
}
