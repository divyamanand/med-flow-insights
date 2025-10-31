import { Router } from 'express';
import { StaffController } from '../controllers/StaffController';
import { validateBody } from '../middleware/validate';
import { AddTimingDto, CreateDoctorDto, CreateStaffDto, RequestLeaveDto } from '../dto/staff.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new StaffController();

router.post('/', requireRoles(Roles.Admin), validateBody(CreateStaffDto), ctrl.createStaff);
router.post('/doctors', requireRoles(Roles.Admin), validateBody(CreateDoctorDto), ctrl.createDoctor);
router.post('/timings', requireRoles(Roles.Admin), validateBody(AddTimingDto), ctrl.addTiming);
router.post('/leaves', validateBody(RequestLeaveDto), ctrl.requestLeave);
router.get('/doctors', ctrl.listDoctors);

// GET routes
router.get('/', requireRoles(Roles.Admin), ctrl.list);
router.get('/:id', requireRoles(Roles.Admin), ctrl.getStaff);
router.get('/doctors/:id', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.getDoctor);
router.get('/:id/timings', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.timings);
router.get('/:id/leaves', requireRoles(Roles.Admin), ctrl.leaves);
router.get('/doctors/:id/appointments', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.doctorAppointments);

export default router;
