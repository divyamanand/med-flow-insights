import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { validateBody } from '../middleware/validate';
import { AddInventoryItemDto, SellInventoryDto } from '../dto/inventory.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new InventoryController();

router.post('/items', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(AddInventoryItemDto), ctrl.addItem);
router.post('/sell', requireRoles(Roles.Admin, Roles.Pharmacist), validateBody(SellInventoryDto), ctrl.sell);

export default router;
