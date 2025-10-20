import { IsOptional, IsString, IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ZoneType } from '../zone.schema';

class PositionDto {
  @IsOptional()
  x?: number;

  @IsOptional()
  y?: number;
}

class SizeDto {
  @IsOptional()
  w?: number;

  @IsOptional()
  h?: number;
}

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ZoneType)
  @IsOptional()
  type?: ZoneType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variables?: string[];

  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  @IsOptional()
  position?: PositionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => SizeDto)
  @IsOptional()
  size?: SizeDto;
}