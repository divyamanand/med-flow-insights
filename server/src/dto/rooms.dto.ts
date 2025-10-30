import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string; // LabRoom, OperationRoom, GenericRoom
}

export class CreateRoomDto {
  @IsInt()
  @Min(1)
  roomNumber!: number;

  @IsString()
  @IsNotEmpty()
  roomName!: string;

  @IsInt()
  @Min(1)
  typeId!: number;
}

export class ChangeRoomStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: 'vacant' | 'occupied' | 'maintenance' | 'cleaning';
}

export class AllocateRoomDto {
  @IsString()
  @IsNotEmpty()
  userId!: string; // staff/patient id

  @IsString()
  @IsNotEmpty()
  requiredRoomType!: string;
}

export class AddRoomStaffRequirementDto {
  @IsInt() @Min(1) roomId!: number;
  @IsString() @IsNotEmpty() role!: string;
  @IsInt() @Min(1) count!: number;
}

export class AddRoomEquipmentRequirementDto {
  @IsInt() @Min(1) roomId!: number;
  @IsString() @IsNotEmpty() equipmentType!: string;
  @IsInt() @Min(1) count!: number;
}
