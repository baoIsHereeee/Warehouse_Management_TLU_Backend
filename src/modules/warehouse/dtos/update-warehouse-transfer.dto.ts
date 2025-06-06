import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { WarehouseTransferDetailDTO } from "./create-warehouse-transfer.dto";

export class UpdateWarehouseTransferDTO {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    fromWarehouseId: string;

    @IsOptional()
    @IsString()
    toWarehouseId: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WarehouseTransferDetailDTO)
    warehouseTransferDetails: WarehouseTransferDetailDTO[];
}