import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new DashboardController();

router.get('/patient/:id', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.patientView);
router.get('/doctor/:id', requireRoles(Roles.Admin, Roles.Receptionist, Roles.Doctor), ctrl.doctorView);
router.get('/reception', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.receptionView);
router.get('/admin', requireRoles(Roles.Admin), ctrl.adminView);

export default router;
