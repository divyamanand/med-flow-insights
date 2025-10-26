import { Router } from 'express';
import { RoomsController } from '../controllers/RoomsController';
import { validateBody } from '../middleware/validate';
import { AllocateRoomDto, ChangeRoomStatusDto, CreateRoomDto, CreateRoomTypeDto, AddRoomEquipmentRequirementDto, AddRoomStaffRequirementDto } from '../dto/rooms.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new RoomsController();

router.post('/types', requireRoles(Roles.Admin), validateBody(CreateRoomTypeDto), ctrl.createType);
router.post('/', requireRoles(Roles.Admin), validateBody(CreateRoomDto), ctrl.create);
router.get('/', ctrl.list);
router.post('/allocate', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AllocateRoomDto), ctrl.allocate);
router.patch('/:id/status', requireRoles(Roles.Admin), validateBody(ChangeRoomStatusDto), ctrl.changeStatus);
router.post('/requirements/staff', requireRoles(Roles.Admin), validateBody(AddRoomStaffRequirementDto), ctrl.addStaffRequirement);
router.post('/requirements/equipment', requireRoles(Roles.Admin), validateBody(AddRoomEquipmentRequirementDto), ctrl.addEquipmentRequirement);

export default router;
