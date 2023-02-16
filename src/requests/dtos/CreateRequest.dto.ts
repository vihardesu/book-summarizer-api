import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateRequestDto {
    @IsNotEmpty()
    @IsString()
    isbn_ten: string;

    @IsNotEmpty()
    email: string;
}