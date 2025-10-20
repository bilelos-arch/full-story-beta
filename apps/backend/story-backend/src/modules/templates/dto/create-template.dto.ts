import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class VariableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  defaultValue: any;
}

class PositionDto {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

class SizeDto {
  @IsNotEmpty()
  w: number;

  @IsNotEmpty()
  h: number;
}

class ElementDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => SizeDto)
  size: SizeDto;
}

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
  ageRange: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariableDto)
  variables: VariableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementDto)
  elements: ElementDto[];
}