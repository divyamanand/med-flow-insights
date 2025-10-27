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
  date: Date;
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
  delivery_date: Date;
  expiry_date: Date;
  expired: boolean;
};

export type BloodItem = {
  id: string;
  item_id: string;
  blood_group: string;
  type: string;
  delivery_date: Date;
  expiry_date: Date;
  expired: boolean;
};

export type RobotData = {
  obstacle: {
    left: number;
    mid: number;
    right: number;
  };
  direction: string;
  rfids?: Record<string, string>; // Add RFID data type
};

export type MedicineBatch = {
  id: string;
  batchNumber: string;
  expirationDate: Date;
  manufacturer: string;
  quantity: number;
};

export type Medicine = {
  id: string;
  name: string;
  batches: MedicineBatch[];
};


export type BloodInventory = {
  [key in BloodGroup]: {
    available: number;
    critical: number;
  };
};

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// Donation Statistics Type
export type DonationStat = {
  id?: string;
  name: string;
  value: number;
  color: string;
  createdAt?: Date;
};

// Donor Demographics Type
export type DonorAgeGroup = {
  id?: string;
  name: string;
  value: number;
  color: string;
  updatedAt?: Date;
};

// Monthly Donations Type
export type MonthlyDonation = {
  id?: string;
  month: string;
  donations: number;
  year?: number;
  createdAt?: Date;
};

// Blood Request Type
export type BloodRequest = {
  id?: string;
  bloodGroup: BloodGroup;
  quantity: number;
  priority: "High" | "Medium" | "Low";
  department: string;
  requester: string;
  status: "Pending" | "Fulfilled" | "Cancelled";
  requestedAt: Date;
  fulfilledAt?: Date;
  notes?: string;
};
