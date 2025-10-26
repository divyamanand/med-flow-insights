import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middleware/validate';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateStaffDto } from '../dto/staff.dto';
import { requireAuth } from '../middleware/auth';

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() password!: string;
}

const controller = new AuthController();
const router = Router();

router.post('/login', validateBody(LoginDto), controller.login);

// Public when no users exist; Admin-only otherwise (enforced in controller)
router.post('/register', validateBody(CreateStaffDto), controller.register);

export default router;
