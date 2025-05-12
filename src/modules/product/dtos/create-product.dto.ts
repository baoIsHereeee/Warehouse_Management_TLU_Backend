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

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value)) 
    @Min(0)
    current_stock: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    minimum_stock: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    selling_price: number;

    @IsString()
    @IsOptional()
    category_id: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;
}