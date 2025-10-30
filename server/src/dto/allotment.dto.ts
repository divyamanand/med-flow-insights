import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class RequestStaffAllotmentDto {
  @IsInt() @Min(1) roomId!: number;
  @IsString() @IsNotEmpty() staffId!: string;
  @IsInt() @Min(1) minutes!: number;
}

export class ReleaseStaffAllotmentDto {
  @IsString() @IsNotEmpty() staffId!: string;
  @IsOptional() @IsInt() @Min(1) roomId?: number;
}
