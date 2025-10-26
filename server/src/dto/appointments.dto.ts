import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsOptional() @IsString() speciality?: string; // strategy will pick doctor
  @IsDateString() timestamp!: string;
}
