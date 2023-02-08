import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateChapterDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    sequence_index: number;

    @IsNotEmpty()
    @IsString()
    contents: string;
}