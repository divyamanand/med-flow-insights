import { Patient } from "./types";
import { Timestamp } from "firebase/firestore";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getPatientDate = (patient: Patient): Date => {
  return patient.date instanceof Timestamp ? patient.date.toDate() : patient.date;
};