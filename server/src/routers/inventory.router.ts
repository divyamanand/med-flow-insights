import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { validateBody } from '../middleware/validate';
import { AddInventoryItemDto, SellInventoryDto, AddInventoryStockDto, AllotEquipmentDto, ReleaseEquipmentDto, RequestEquipmentDto } from '../dto/inventory.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new InventoryController();

router.get('/items', ctrl.listItems);
router.post('/items', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(AddInventoryItemDto), ctrl.addItem);
router.post('/sell', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(SellInventoryDto), ctrl.sell);
router.post('/stock', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(AddInventoryStockDto), ctrl.addStock);
router.post('/equipment/allot', requireRoles(Roles.Admin), validateBody(AllotEquipmentDto), ctrl.allotEquipment);
router.post('/equipment/release', requireRoles(Roles.Admin), validateBody(ReleaseEquipmentDto), ctrl.releaseEquipment);
router.post('/equipment/process-requirements', requireRoles(Roles.Admin), ctrl.processEquipmentRequirements);
router.post('/equipment/request', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(RequestEquipmentDto), ctrl.requestEquipment);

export default router;
