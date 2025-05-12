import { IsOptional, IsString } from "class-validator";

export class UpdateSupplierDTO {
    @IsString()
    @IsOptional()
    fullname: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;
}