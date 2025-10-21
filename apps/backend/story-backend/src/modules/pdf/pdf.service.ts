import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITemplate } from '../templates/template.schema';
import { TemplatesService } from '../templates/templates.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  constructor(
    @InjectModel('Template') private templateModel: Model<ITemplate>,
    private templatesService: TemplatesService,
  ) {}

  async generateCustomPDF(templateId: string, userValues: Record<string, string>): Promise<string> {
    // Charger le template depuis la base de données
    const template = await this.templatesService.findOne(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Créer un nouveau document PDF
    const doc = new PDFDocument();

    // Définir le chemin de sortie
    const outputDir = path.join(process.cwd(), 'uploads', 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `generated_${templateId}_${Date.now()}.pdf`);

    // Créer le flux d'écriture
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Ajouter le contenu du template avec les valeurs utilisateur
    doc.fontSize(16).text(template.title, 50, 50);
    doc.fontSize(12).text(`Description: ${template.description}`, 50, 80);

    let yPosition = 120;
    for (const [key, value] of Object.entries(userValues)) {
      doc.fontSize(12).text(`${key}: ${value}`, 50, yPosition);
      yPosition += 20;
    }

    // Finaliser le PDF
    doc.end();

    // Retourner le chemin du fichier généré
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);
    });
  }
}