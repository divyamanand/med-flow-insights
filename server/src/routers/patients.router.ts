import { Router } from 'express';
import { PatientsController } from '../controllers/PatientsController';
import { validateBody } from '../middleware/validate';
import { AddIssueDto, AdmitPatientDto, AdmitPatientFullDto, AdmitPatientWithStaffDto, CreatePatientDto, DischargePatientDto } from '../dto/patients.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new PatientsController();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(CreatePatientDto), ctrl.create);
router.post('/issues', requireRoles(Roles.Doctor, Roles.Admin), validateBody(AddIssueDto), ctrl.addIssue);
router.post('/admissions', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientDto), ctrl.admit);
router.post('/admissions/with-staff', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientWithStaffDto), ctrl.admitWithStaff);
router.post('/admissions/full', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientFullDto), ctrl.admitFull);
router.post('/discharge', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(DischargePatientDto), ctrl.discharge);

export default router;
