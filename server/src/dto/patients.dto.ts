import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString() @IsNotEmpty() roomId!: number;
}
