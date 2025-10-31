import { Router } from 'express';
import { PatientsController } from '../controllers/PatientsController';
import { validateBody } from '../middleware/validate';
import { AddIssueDto, AdmitPatientDto, AdmitPatientFullDto, AdmitPatientWithStaffDto, CreatePatientDto, DischargePatientDto } from '../dto/patients.dto';
import { requireRoles } from '../middleware/auth';
import { Roles } from '../utils/roles';

const router = Router();
const ctrl = new PatientsController();

router.post('/', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(CreatePatientDto), ctrl.create);
router.post('/issues', requireRoles(Roles.Doctor, Roles.Admin), validateBody(AddIssueDto), ctrl.addIssue);
router.post('/admissions', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientDto), ctrl.admit);
router.post('/admissions/with-staff', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientWithStaffDto), ctrl.admitWithStaff);
router.post('/admissions/full', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(AdmitPatientFullDto), ctrl.admitFull);
router.post('/discharge', requireRoles(Roles.Admin, Roles.Receptionist), validateBody(DischargePatientDto), ctrl.discharge);

// GET routes
router.get('/', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.list);
router.get('/:id', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.getById);
router.get('/:id/issues', requireRoles(Roles.Admin, Roles.Receptionist, Roles.Doctor), ctrl.issues);
router.get('/:id/appointments', requireRoles(Roles.Admin, Roles.Receptionist, Roles.Doctor), ctrl.appointments);
router.get('/:id/admission', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.currentAdmission);
router.get('/:id/admissions', requireRoles(Roles.Admin, Roles.Receptionist), ctrl.admissions);
router.get('/:id/prescriptions', requireRoles(Roles.Admin, Roles.Receptionist, Roles.Doctor), ctrl.prescriptions);

export default router;
