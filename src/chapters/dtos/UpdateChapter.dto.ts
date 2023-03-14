import { IsString, IsNotEmpty, MinLength, IsInt, IsOptional } from "class-validator";

export class UpdateChapterDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    sequence_index: number;

    @IsOptional()
    @IsString()
    contents: string;

    @IsOptional()
    part: string;
}