import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    image: string;

    // @IsNotEmpty()
    // @IsNumber()
    // @Transform(({ value }) => Number(value)) 
    // @Min(0)
    // currentStock: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value)) 
    @Min(0)
    minimumStock: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    sellingPrice: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value)) 
    @Min(0)
    orderStock: number;

    @IsString()
    @IsOptional()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}