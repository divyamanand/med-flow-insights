import { Request, Response } from 'express';
import { ok } from '../utils/response';
import { AppointmentRepository } from '../repositories/AppointmentRepositories';
import { PrescriptionRepository } from '../repositories/PrescriptionRepositories';
import { PatientIssueRepository, AdmissionRepository } from '../repositories/PatientRepositories';
import { StaffTimingRepository, DoctorRepository, StaffRepository } from '../repositories/StaffRepositories';
import { RoomRepository } from '../repositories/RoomRepositories';

export class DashboardController {
  private apptRepo = new AppointmentRepository();
  private presRepo = new PrescriptionRepository();
  private issueRepo = new PatientIssueRepository();
  private admissionRepo = new AdmissionRepository();
  private timingRepo = new StaffTimingRepository();
  private doctorRepo = new DoctorRepository();
  private staffRepo = new StaffRepository();
  private roomRepo = new RoomRepository();

  patientView = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const [admission, appointments, prescriptions, issues] = await Promise.all([
      this.admissionRepo.findOne({ where: { patientId: String(id), dischargedAt: null } as any, order: { admittedAt: 'DESC' } as any }),
      this.apptRepo.find({ where: { patientId: String(id) } as any, order: { timestamp: 'ASC' } as any }),
      this.presRepo.find({ where: { patientId: String(id) } as any, order: { createdAt: 'DESC' } as any }),
      this.issueRepo.find({ where: { patientId: String(id) } as any, order: { createdAt: 'DESC' } as any }),
    ]);
    res.json(ok({ admission, appointments, prescriptions, issues }));
  };

  doctorView = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const today = new Date();
    const dayStart = new Date(today); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(today); dayEnd.setHours(23,59,59,999);
    const [timings, todaysAppointments] = await Promise.all([
      this.timingRepo.find({ where: { staffId: String(id) } as any }),
      this.apptRepo.find({ where: { doctorId: String(id) } as any })
    ]);
    const todays = todaysAppointments.filter(a => a.timestamp >= dayStart && a.timestamp <= dayEnd);
    const patients = Array.from(new Set(todays.map(a => (a as any).patientId)));
    res.json(ok({ timings, todaysAppointments: todays, patients }));
  };

  receptionView = async (_req: Request, res: Response) => {
    const rooms = await this.roomRepo.list();
    const summary = rooms.reduce((acc: any, r: any) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
    const admitted = await this.admissionRepo.find({ where: { dischargedAt: null } as any });
    const doctors = await this.doctorRepo.find();
    const staff = await this.staffRepo.find();
    res.json(ok({ roomsSummary: summary, admittedCount: admitted.length, doctorsCount: doctors.length, staffCount: staff.length }));
  };

  adminView = async (_req: Request, res: Response) => {
    const [rooms, doctors, staff] = await Promise.all([
      this.roomRepo.list(), this.doctorRepo.find(), this.staffRepo.find()
    ]);
    res.json(ok({ rooms: rooms.length, doctors: doctors.length, staff: staff.length }));
  };
}
