import { Router } from 'express';
import { PrescriptionsController } from '../controllers/PrescriptionsController';
import { validateBody } from '../middleware/validate';
import { CreatePrescriptionDto } from '../dto/prescriptions.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new PrescriptionsController();

router.post('/', requireRoles(Roles.Doctor, Roles.Admin), validateBody(CreatePrescriptionDto), ctrl.create);

export default router;
