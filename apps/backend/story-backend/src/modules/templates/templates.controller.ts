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
  UploadedFile,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ITemplate } from './template.schema';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('pdf'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Créer un nouveau template avec upload de fichier PDF' })
  @ApiResponse({ status: 201, description: 'Template créé avec succès' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdf: {
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
        ageRange: {
          type: 'string',
        },
        variables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              defaultValue: { type: 'string' },
            },
          },
        },
        elements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              content: { type: 'string' },
              position: {
                type: 'object',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                },
              },
              size: {
                type: 'object',
                properties: {
                  w: { type: 'number' },
                  h: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  })
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<ITemplate> {
    let pdfPath: string | undefined;
    if (file) {
      // Handle file upload logic here, e.g., save to disk or cloud storage
      // For now, we'll assume the path is generated
      pdfPath = `uploads/templates/${file.filename}`;
    }
    return this.templatesService.create(createTemplateDto, req.user.userId, pdfPath);
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
}