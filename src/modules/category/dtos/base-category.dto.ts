import { IsNotEmpty, IsString } from "class-validator";

export class BaseCategoryDTO { 
  @IsNotEmpty()
  @IsString()
  name: string;
  
  description: string;
} 