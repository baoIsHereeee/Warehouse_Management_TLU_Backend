import { IsNotEmpty, IsString } from "class-validator";

export class BaseRoleDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
}