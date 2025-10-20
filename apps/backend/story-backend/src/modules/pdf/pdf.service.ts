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

    // Traiter chaque élément du template
    for (const element of template.elements) {
      let content = element.content;

      // Remplacer les variables dans le contenu
      for (const [key, value] of Object.entries(userValues)) {
        content = content.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
      }

      // Positionner l'élément
      doc.save();
      doc.translate(element.position.x, element.position.y);

      if (element.type === 'text') {
        // Insérer le texte
        doc.fontSize(12).text(content, 0, 0, {
          width: element.size.w,
          height: element.size.h,
        });
      } else if (element.type === 'image') {
        // Insérer l'image
        const imagePath = path.join(process.cwd(), content);
        if (fs.existsSync(imagePath)) {
          doc.image(imagePath, 0, 0, {
            width: element.size.w,
            height: element.size.h,
          });
        }
      }

      doc.restore();
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