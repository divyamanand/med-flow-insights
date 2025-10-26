export const Roles = {
  Admin: 'Admin',
  Doctor: 'Doctor',
  Nurse: 'Nurse',
  Pharmacist: 'Pharmacist',
  Receptionist: 'Receptionist',
  Technician: 'Technician',
} as const;

export type Role = typeof Roles[keyof typeof Roles];
