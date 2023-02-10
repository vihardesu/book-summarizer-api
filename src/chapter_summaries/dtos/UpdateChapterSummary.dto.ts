import { IsString, MinLength, IsISBN, IsOptional, IsUrl } from "class-validator";

export class UpdateChapterSummaryDto {
    @IsOptional()
    clean_chapter_name: string;

    @IsOptional()
    summary_type: string;

    @IsOptional()
    sequence_index: number;

    @IsOptional()
    contents: string;

    @IsOptional()
    cid: string;

    @IsOptional()
    isbn_ten: string;
}