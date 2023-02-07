import { IsString, IsNotEmpty, MinLength, IsInt } from "class-validator";

export class UpdateBookDto {
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