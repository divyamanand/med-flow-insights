import { Router } from 'express';
import { AppointmentsController } from '../controllers/AppointmentsController';
import { validateBody } from '../middleware/validate';
import { CreateAppointmentDto } from '../dto/appointments.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new AppointmentsController();

router.get('/', ctrl.list);
router.post('/', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(CreateAppointmentDto), ctrl.create);

export default router;
