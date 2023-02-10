import { IsString, IsNotEmpty, MinLength, IsISBN, IsOptional, IsUrl } from "class-validator";

export class CreateChapterSummaryDto {

    @IsNotEmpty()
    clean_chapter_name: string;

    @IsNotEmpty()
    summary_type: string;

    @IsNotEmpty()
    sequence_index: number;

    @IsNotEmpty()
    contents: string;

    @IsNotEmpty()
    cid: string;

    @IsNotEmpty()
    isbn_ten: string;

}