import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateStaffDto {
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsString() @IsNotEmpty() dob!: string; // YYYY-MM-DD
  @IsString() @IsNotEmpty() gender!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() contact!: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsString() @IsNotEmpty() role!: string;
  @IsString() @IsNotEmpty() password!: string;
}

export class CreateDoctorDto {
  @IsString() @IsNotEmpty() staffId!: string; // link existing staff with role Doctor
  @IsOptional() specialities?: string[]; // optional list of speciality strings
}

export class AddTimingDto {
  @IsString() @IsNotEmpty() staffId!: string;
  @IsString() @IsNotEmpty() day!: string;
  @IsString() @IsNotEmpty() startTime!: string;
  @IsString() @IsNotEmpty() endTime!: string;
}

export class RequestLeaveDto {
  @IsString() @IsNotEmpty() staffId!: string;
  @IsString() @IsNotEmpty() startDate!: string; // ISO date
  @IsString() @IsNotEmpty() endDate!: string;   // ISO date
}
