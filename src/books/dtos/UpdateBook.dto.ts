import { IsString, IsNotEmpty, MinLength, IsISBN, IsOptional, IsUrl } from "class-validator";

export class UpdateBookDto {
    @IsOptional()
    title: string;

    @IsOptional()
    subtitle?: string;

    @IsOptional()
    authors: string;

    @IsOptional()
    publisher?: string;

    @IsOptional()
    published_date?: string;

    @IsOptional()
    description: string;

    @IsOptional()
    page_count: number;

    @IsOptional()
    categories: string;

    @IsOptional()
    @IsUrl()
    thumbnail: string;

    @IsOptional()
    isbn_thirteen: string;
}