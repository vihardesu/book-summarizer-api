import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @MinLength(8)
    author: string;

    @IsNotEmpty()
    @IsString()
    isbn: string;
}