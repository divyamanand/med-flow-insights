import { Patient, SupplyItem, BloodItem } from "./types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPatientDate = (patient: Patient): Date => {
  return patient.date instanceof Date ? patient.date : new Date(patient.date);
};

// Helper function to safely get ISO string from a Date
export const getISOString = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
};

// Helper function to convert to a format-compatible Date
export const toCompatibleDate = (date: Date | string | null | undefined): Date => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return new Date(date);
};
