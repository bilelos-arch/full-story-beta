import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ITemplate } from './template.schema';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer un nouveau template avec upload de fichier PDF et image de couverture' })
  @ApiResponse({ status: 201, description: 'Template créé avec succès' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdf: {
          type: 'string',
          format: 'binary',
        },
        coverImage: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        category: {
          type: 'string',
        },
        genre: {
          type: 'string',
        },
        ageRange: {
          type: 'string',
        },
        status: {
          type: 'string',
          enum: ['draft', 'public'],
        },
      },
    },
  })
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @UploadedFiles() files: { pdf?: Express.Multer.File[], coverImage?: Express.Multer.File[] },
    @Request() req: any,
  ): Promise<ITemplate> {
    console.log('Backend Controller - CreateTemplateDto received:', createTemplateDto);
    console.log('Backend Controller - Uploaded files:', {
      pdf: files.pdf?.[0] ? { filename: files.pdf[0].filename, size: files.pdf[0].size, mimetype: files.pdf[0].mimetype } : 'No PDF uploaded',
      coverImage: files.coverImage?.[0] ? { filename: files.coverImage[0].filename, size: files.coverImage[0].size, mimetype: files.coverImage[0].mimetype } : 'No cover image uploaded'
    });
    console.log('Backend Controller - Request user:', req.user);

    let pdfPath: string | undefined;
    let coverImagePath: string | undefined;

    // Ensure uploads/templates directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads', 'templates');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (files.pdf && files.pdf[0]) {
      // Generate unique filename and save PDF file
      const pdfFileName = `template_${Date.now()}_${Math.random().toString(36).substring(2)}.pdf`;
      const pdfFilePath = path.join(uploadsDir, pdfFileName);

      // Write the file buffer to disk
      fs.writeFileSync(pdfFilePath, files.pdf[0].buffer);
      pdfPath = pdfFileName;
      console.log('Backend Controller - PDF file saved to:', pdfFilePath);
    }

    if (files.coverImage && files.coverImage[0]) {
      // Generate unique filename and save cover image file
      const coverFileName = `cover_${Date.now()}_${Math.random().toString(36).substring(2)}.${files.coverImage[0].mimetype.split('/')[1]}`;
      const coverFilePath = path.join(uploadsDir, coverFileName);

      // Write the file buffer to disk
      fs.writeFileSync(coverFilePath, files.coverImage[0].buffer);
      coverImagePath = coverFileName;
      console.log('Backend Controller - Cover image saved to:', coverFilePath);
    }
    return this.templatesService.create(createTemplateDto, req.user.userId, pdfPath, coverImagePath);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les templates ou les templates populaires' })
  @ApiResponse({ status: 200, description: 'Liste des templates récupérée avec succès' })
  async findAll(
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ): Promise<ITemplate[]> {
    if (limit && status && sort) {
      return this.templatesService.findPopular(parseInt(limit), status, sort);
    }
    return this.templatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un template par ID' })
  @ApiResponse({ status: 200, description: 'Template récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Template non trouvé' })
  async findOne(@Param('id') id: string): Promise<ITemplate> {
    return this.templatesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour un template par ID' })
  @ApiResponse({ status: 200, description: 'Template mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Template non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<ITemplate> {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un template' })
  @ApiResponse({ status: 200, description: 'Statut du template mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Template non trouvé' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<ITemplate> {
    return this.templatesService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Supprimer un template par ID' })
  @ApiResponse({ status: 200, description: 'Template supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Template non trouvé' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.templatesService.remove(id);
  }

  @Get('pdf/:filename')
  @ApiOperation({ summary: 'Servir un fichier PDF statiquement' })
  @ApiResponse({ status: 200, description: 'Fichier PDF servi avec succès' })
  @ApiResponse({ status: 404, description: 'Fichier PDF non trouvé' })
  async servePdf(@Param('filename') filename: string, @Res() res: any): Promise<void> {
    const filePath = `uploads/templates/${filename}`;
    const fs = require('fs');
    const path = require('path');

    const fullPath = path.resolve('.', filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Fichier PDF non trouvé' });
    }

    res.sendFile(fullPath);
  }

  @Get('cover/:filename')
  @ApiOperation({ summary: 'Servir une image de couverture statiquement' })
  @ApiResponse({ status: 200, description: 'Image de couverture servie avec succès' })
  @ApiResponse({ status: 404, description: 'Image de couverture non trouvée' })
  async serveCoverImage(@Param('filename') filename: string, @Res() res: any): Promise<void> {
    const filePath = `uploads/templates/${filename}`;
    res.sendFile(filePath, { root: '.' });
  }
}