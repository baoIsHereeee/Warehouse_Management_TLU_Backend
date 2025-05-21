import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { ExportDetailDTO } from "./create-export.dto";

export class UpdateExportDTO {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    customerId: string;

    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExportDetailDTO)
    exportDetails: ExportDetailDTO[];
}
