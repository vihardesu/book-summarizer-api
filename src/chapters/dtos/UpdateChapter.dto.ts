import { IsString, IsNotEmpty, MinLength, IsInt, IsOptional } from "class-validator";

export class UpdateChapterDto {
    @IsOptional()
    name: string;

    @IsOptional()
    sequence_index: number;

    @IsOptional()
    @IsString()
    contents: string;
}