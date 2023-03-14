import { IsString, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateChapterDto {
    @IsNotEmpty()
    @IsString()
    isbn_ten: string;

    @IsOptional()
    part: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    sequence_index: number;

    @IsNotEmpty()
    @IsString()
    contents: string;
}