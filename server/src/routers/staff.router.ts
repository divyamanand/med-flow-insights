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

export default router;
