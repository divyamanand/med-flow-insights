import { Router } from 'express';
import { PatientsController } from '../controllers/PatientsController';
import { validateBody } from '../middleware/validate';
import { AddIssueDto, AdmitPatientDto, CreatePatientDto } from '../dto/patients.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new PatientsController();

router.post('/', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(CreatePatientDto), ctrl.create);
router.post('/issues', requireRoles(Roles.Doctor, Roles.Admin), validateBody(AddIssueDto), ctrl.addIssue);
router.post('/admissions', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientDto), ctrl.admit);

export default router;
