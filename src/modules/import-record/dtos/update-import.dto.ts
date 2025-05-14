import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { ImportDetailDTO } from "./create-import.dto";

export class UpdateImportDTO {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    customerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportDetailDTO)
    exportDetails: ImportDetailDTO[];
}