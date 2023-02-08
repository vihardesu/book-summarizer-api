import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateChapterDto {
    @IsNotEmpty()
    @IsString()
    isbn_ten: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    sequence_index: number;

    @IsNotEmpty()
    @IsString()
    contents: string;
}