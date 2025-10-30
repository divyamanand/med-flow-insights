import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class AddInventoryItemDto {
  @IsIn(['medicine', 'blood', 'equipment']) kind!: 'medicine' | 'blood' | 'equipment';
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsInt() @Min(1) quantity!: number; // initial stock
}

export class SellInventoryDto {
  @IsString() @IsNotEmpty() itemIdOrName!: string; // support id or name for convenience
  @IsInt() @Min(1) quantity!: number;
}

export class AddInventoryStockDto {
  @IsString() @IsNotEmpty() itemIdOrName!: string; // support id or name
  @IsInt() @Min(1) quantity!: number;
}

export class AllotEquipmentDto {
  @IsString() @IsNotEmpty() itemName!: string;
  @IsInt() @Min(1) roomId!: number;
  @IsOptional() @IsInt() @Min(1) quantity?: number;
  @IsOptional() @IsInt() @Min(1) minutes?: number;
}

export class ReleaseEquipmentDto {
  @IsString() @IsNotEmpty() itemName!: string;
  @IsInt() @Min(1) roomId!: number;
}

export class RequestEquipmentDto {
  @IsInt() @Min(1) roomId!: number;
  @IsString() @IsNotEmpty() equipmentType!: string;
  @IsOptional() @IsInt() @Min(1) quantity?: number;
  @IsOptional() @IsInt() @Min(1) minutes?: number;
}
