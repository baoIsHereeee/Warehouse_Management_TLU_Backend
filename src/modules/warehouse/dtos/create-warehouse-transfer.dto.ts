import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, IsArray, ValidateNested } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class CreateWarehouseTransferDTO {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    fromWarehouseId: string;

    @IsNotEmpty()
    @IsString()
    toWarehouseId: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WarehouseTransferDetailDTO)
    warehouseTransferDetails: WarehouseTransferDetailDTO[];
}

export class WarehouseTransferDetailDTO {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}