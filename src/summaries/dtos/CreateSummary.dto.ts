import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateSummaryDto {
    @IsNotEmpty()
    @IsString()
    isbn_ten: string;

    @IsNotEmpty()
    tokens: number;

    @IsNotEmpty()
    @IsString()
    summary_type: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}