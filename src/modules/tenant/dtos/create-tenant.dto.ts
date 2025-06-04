import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class CreateTenantDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}
