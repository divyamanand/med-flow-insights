
import { Patient, SupplyItem, BloodItem } from "./types";
import { Timestamp } from "firebase/firestore";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPatientDate = (patient: Patient): Date => {
  return patient.date instanceof Timestamp ? patient.date.toDate() : patient.date;
};

// Helper function to safely get ISO string from a Date or Timestamp
export const getISOString = (date: Timestamp | Date): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toISOString();
  }
  return date.toISOString();
};

// Helper function to convert a Timestamp or Date to a format-compatible Date
export const toCompatibleDate = (date: Timestamp | Date): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return date;
};
