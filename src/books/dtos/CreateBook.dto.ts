import { IsString, IsNotEmpty, MinLength, IsISBN, IsOptional, IsUrl } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    subtitle?: string;

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsISBN()
    isbn_10: string;

    @IsNotEmpty()
    @IsISBN()
    isbn_13: string;
}