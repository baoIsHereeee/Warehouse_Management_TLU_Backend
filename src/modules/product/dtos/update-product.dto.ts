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

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value)) 
    @Min(0)
    current_stock: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    minimum_stock: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(0)
    selling_price: number;

    @IsString()
    @IsOptional()
    category_id: string;
}