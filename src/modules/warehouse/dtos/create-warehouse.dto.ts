import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWarehouseDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    phone: string;
}