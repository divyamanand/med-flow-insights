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
