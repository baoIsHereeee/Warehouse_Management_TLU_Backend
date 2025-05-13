import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateWarehouseDTO {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    phone: string;
}