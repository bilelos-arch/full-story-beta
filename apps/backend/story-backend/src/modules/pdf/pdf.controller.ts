import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('pdf')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Générer un PDF personnalisé à partir d\'un template' })
  @ApiResponse({ status: 201, description: 'PDF généré avec succès', schema: { type: 'object', properties: { pdfUrl: { type: 'string' } } } })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async generatePdf(@Body() generatePdfDto: GeneratePdfDto): Promise<{ pdfUrl: string }> {
    const { templateId, userValues } = generatePdfDto;
    const pdfPath = await this.pdfService.generateCustomPDF(templateId, userValues);

    // Convertir le chemin absolu en URL relative
    const relativePath = pdfPath.replace(process.cwd(), '').replace(/\\/g, '/');

    return { pdfUrl: relativePath };
  }

  @Get('generated')
  @ApiOperation({ summary: 'Récupérer la liste des PDFs générés' })
  @ApiResponse({ status: 200, description: 'Liste des PDFs générés', schema: { type: 'array', items: { type: 'object', properties: { filename: { type: 'string' }, path: { type: 'string' }, createdAt: { type: 'string' } } } } })
  async getGeneratedPdfs(): Promise<any[]> {
    const generatedDir = path.join(process.cwd(), 'uploads', 'generated');

    if (!fs.existsSync(generatedDir)) {
      return [];
    }

    const files = fs.readdirSync(generatedDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    return pdfFiles.map(filename => ({
      filename,
      path: `/uploads/generated/${filename}`,
      createdAt: fs.statSync(path.join(generatedDir, filename)).birthtime,
    }));
  }
}