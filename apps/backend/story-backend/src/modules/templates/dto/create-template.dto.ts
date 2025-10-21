import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  ageRange: string;

  @IsEnum(['draft', 'public'])
  @IsNotEmpty()
  status: 'draft' | 'public';
}