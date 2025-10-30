import { Router } from 'express';
import { StaffAllotmentController } from '../controllers/StaffAllotmentController';
import { validateBody } from '../middleware/validate';
import { RequestStaffAllotmentDto, ReleaseStaffAllotmentDto } from '../dto/allotment.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new StaffAllotmentController();

router.post('/request', requireRoles(Roles.Admin), validateBody(RequestStaffAllotmentDto), ctrl.request);
router.get('/assignments/staff', requireRoles(Roles.Admin), ctrl.listStaff);
router.get('/assignments/room', requireRoles(Roles.Admin), ctrl.listRoom);
router.post('/release', requireRoles(Roles.Admin), validateBody(ReleaseStaffAllotmentDto), ctrl.release);
router.post('/process/pending', requireRoles(Roles.Admin), ctrl.processPending);
router.post('/process/room-requirements', requireRoles(Roles.Admin), ctrl.processRoomRequirements);

export default router;
