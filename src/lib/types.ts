
import { Timestamp } from 'firebase/firestore';

export type Doctor = {
  id: string;
  name: string;
  speciality: string[]; // array of strings
  timings: string;
  room_no: string;
  available: boolean;
};

export type Patient = {
  id: string;
  name: string;
  issues: string[];
  type: string; // Using union type for specific values
  date: Timestamp | Date;
  ipd_no: string;
  doctor: string;
  staff: string[];
  medicines: string[];
};

export type SupplyItem = {
  id: string;
  item_id: string;
  name: string;
  type: string;
  delivery_date: Timestamp | Date;
  expiry_date: Timestamp | Date;
  expired: boolean;
};

export type BloodItem = {
  id: string;
  item_id: string;
  blood_group: string;
  type: string;
  delivery_date: Timestamp | Date;
  expiry_date: Timestamp | Date;
  expired: boolean;
};

export type RobotData = {
  direction: 'straight' | 'left' | 'right' | 'backward';
  obstacle: {
    left: number;
    mid: number;
    right: number;
  };
};
