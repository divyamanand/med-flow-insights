import { Router } from 'express';
import { StaffAllotmentController } from '../controllers/StaffAllotmentController';
import { validateBody } from '../middleware/validate';
import { RequestStaffAllotmentDto } from '../dto/allotment.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new StaffAllotmentController();

router.post('/request', requireRoles(Roles.Admin), validateBody(RequestStaffAllotmentDto), ctrl.request);
router.get('/assignments/staff', requireRoles(Roles.Admin), ctrl.listStaff);
router.get('/assignments/room', requireRoles(Roles.Admin), ctrl.listRoom);

export default router;
