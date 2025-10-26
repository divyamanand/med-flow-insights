import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RequestStaffAllotmentDto {
  @IsInt() @Min(1) roomId!: number;
  @IsString() @IsNotEmpty() role!: string;
  @IsInt() @Min(1) minutes!: number;
}
