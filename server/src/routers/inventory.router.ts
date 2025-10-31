import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { validateBody } from '../middleware/validate';
import { AddInventoryItemDto, SellInventoryDto, AddInventoryStockDto, AllotEquipmentDto, ReleaseEquipmentDto, RequestEquipmentDto } from '../dto/inventory.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new InventoryController();

router.post('/items', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(AddInventoryItemDto), ctrl.addItem);
router.post('/sell', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(SellInventoryDto), ctrl.sell);
router.post('/stock', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(AddInventoryStockDto), ctrl.addStock);
router.post('/equipment/allot', requireRoles(Roles.Admin), validateBody(AllotEquipmentDto), ctrl.allotEquipment);
router.post('/equipment/release', requireRoles(Roles.Admin), validateBody(ReleaseEquipmentDto), ctrl.releaseEquipment);
router.post('/equipment/process-requirements', requireRoles(Roles.Admin), ctrl.processEquipmentRequirements);
router.post('/equipment/request', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(RequestEquipmentDto), ctrl.requestEquipment);

// GET routes
router.get('/items', requireRoles(Roles.Admin, Roles.Pharmacist), ctrl.listItems);
router.get('/items/:id', requireRoles(Roles.Admin, Roles.Pharmacist), ctrl.getItem);
router.get('/items/:id/stocks', requireRoles(Roles.Admin, Roles.Pharmacist), ctrl.stocks);
router.get('/equipment/requirements', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.equipmentRequirements);
router.get('/equipment/allotments/active', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.activeEquipmentAllotments);
router.get('/availability', requireRoles(Roles.Admin, Roles.Pharmacist), ctrl.availability);

export default router;
