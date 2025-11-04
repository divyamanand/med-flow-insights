import { Router } from 'express';
import roomsRouter from '../routers/rooms.router';
import staffRouter from '../routers/staff.router';
import patientsRouter from '../routers/patients.router';
import appointmentsRouter from '../routers/appointments.router';
import prescriptionsRouter from '../routers/prescriptions.router';
import inventoryRouter from '../routers/inventory.router';
import allotmentRouter from '../routers/allotment.router';
import dashboardRouter from '../routers/dashboard.router';
import authRouter from '../routers/auth.router';
import { requireAuth } from '../middleware/auth';

export const router = Router();

// Public auth endpoints first
router.use('/auth', authRouter);

// Protect all subsequent routes
router.use(requireAuth);

router.use('/rooms', roomsRouter);
router.use('/staff', staffRouter);
router.use('/patients', patientsRouter);
router.use('/appointments', appointmentsRouter);
router.use('/prescriptions', prescriptionsRouter);
router.use('/inventory', inventoryRouter);
router.use('/allotments', allotmentRouter);
router.use('/dashboard', dashboardRouter);

export default router;
