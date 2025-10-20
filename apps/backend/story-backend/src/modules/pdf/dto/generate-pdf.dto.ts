import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePdfDto {
  @ApiProperty({
    description: 'ID du template à utiliser pour générer le PDF',
    example: '60d5ecb74b24c72b8c8b4567',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Valeurs utilisateur pour remplacer les variables du template',
    example: { name: 'John Doe', age: '25' },
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsObject()
  userValues: Record<string, string>;
}