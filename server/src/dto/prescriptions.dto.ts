import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString() @IsNotEmpty() patientId!: string;
  @IsString() @IsNotEmpty() doctorId!: string;
  // items: record of name -> quantity
  items!: Record<string, number>;
  @IsArray() tests!: string[];
  @IsOptional() @IsInt() @Min(0) nextVisitDateDays?: number;
  @IsOptional() @IsString() remarks?: string;
}
