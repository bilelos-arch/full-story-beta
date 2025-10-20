import { IsNotEmpty, IsString, IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ZoneType } from '../zone.schema';

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

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ZoneType)
  type: ZoneType;

  @IsArray()
  @IsString({ each: true })
  variables: string[];

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