import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsDateString() timestamp!: string;
  @IsOptional() @IsString() speciality?: string; // optional speciality hint
  @IsOptional() @IsString() doctorId?: string;   // optionally pin to a doctor
  @IsOptional() @IsInt() @Min(1) duration?: number; // minutes, defaults to 15
}
