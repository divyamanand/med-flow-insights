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
router.post('/register', validateBody(CreateStaffDto), controller.register);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);

export default router;
