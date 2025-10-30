import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsArray } from 'class-validator'; // Ensure IsArray is imported

export class CreatePatientDto {
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsString() @IsNotEmpty() dob!: string;
  @IsString() @IsNotEmpty() gender!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() contact!: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsString() @IsNotEmpty() password!: string;
}

export class AddIssueDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsString() @IsNotEmpty() issue!: string;
}

export class AdmitPatientDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsInt() @Min(1) roomId!: number;
}

export class DischargePatientDto {
  @IsString() @IsNotEmpty() patientId!: string;
}

export class AdmitPatientWithStaffDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsInt() @Min(1) roomId!: number;
  @IsOptional() @IsInt() @Min(1) minutes?: number; // duration for temporary staff requests
}

export class AdmitPatientFullDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsInt() @Min(1) roomId!: number;
  @IsOptional() @IsArray() issues?: string[]; // for doctor selection
  @IsOptional() @IsInt() @Min(1) apptDuration?: number; // minutes for appointment
  @IsOptional() @IsInt() @Min(1) staffMinutes?: number; // minutes for staff temporary requests
}
