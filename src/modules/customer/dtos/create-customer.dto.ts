import { IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerDTO {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}