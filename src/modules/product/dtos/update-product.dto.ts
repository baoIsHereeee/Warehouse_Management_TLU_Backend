import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    image: string;

    // @IsOptional()
    // @IsNumber()
    // @Transform(({ value }) => Number(value)) 
    // @Min(0)
    // currentStock: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    minimumStock: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    sellingPrice: number;

    @IsString()
    @IsOptional()
    categoryId: string;
}