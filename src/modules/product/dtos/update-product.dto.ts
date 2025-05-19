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
    @Transform(({ value }) => value === '' ? null : value)
    image: string | null;

    // @IsOptional()
    // @IsNumber()
    // @Transform(({ value }) => Number(value)) 
    // @Min(0)
    // currentStock: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value === '' ? null : Number(value))
    @Min(0)
    minimumStock: number | null;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    sellingPrice: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value === '' ? null : Number(value))
    @Min(0)
    orderStock: number | null;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value === '' ? null : value)
    categoryId: string | null;
}