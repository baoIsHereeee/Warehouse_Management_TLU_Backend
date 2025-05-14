import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CreateImportDTO {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    supplierId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportDetailDTO)
    importDetails: ImportDetailDTO[];
}

export class ImportDetailDTO {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    warehouseId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    importPrice: number;
}