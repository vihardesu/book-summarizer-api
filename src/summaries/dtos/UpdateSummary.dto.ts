import { IsString, IsNotEmpty, MinLength, IsInt, IsOptional } from "class-validator";

export class UpdateSummaryDto {

    @IsOptional()
    @IsString()
    contents: string;

    @IsOptional()
    @IsString()
    summary_type: string;

    @IsOptional()
    tokens: number;
}