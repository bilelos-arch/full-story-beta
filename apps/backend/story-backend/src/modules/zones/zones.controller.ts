import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { IZone } from './zone.schema';

@ApiTags('zones')
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Créer une nouvelle zone' })
  @ApiResponse({ status: 201, description: 'Zone créée avec succès' })
  async create(@Body() createZoneDto: CreateZoneDto): Promise<IZone> {
    return this.zonesService.create(createZoneDto);
  }

  @Get(':templateId')
  @ApiOperation({ summary: 'Récupérer les zones par templateId' })
  @ApiResponse({ status: 200, description: 'Zones récupérées avec succès' })
  @ApiParam({ name: 'templateId', description: 'ID du template' })
  async findByTemplateId(@Param('templateId') templateId: string): Promise<IZone[]> {
    return this.zonesService.findByTemplateId(templateId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour une zone par ID' })
  @ApiResponse({ status: 200, description: 'Zone mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Zone non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la zone' })
  async update(
    @Param('id') id: string,
    @Body() updateZoneDto: UpdateZoneDto,
  ): Promise<IZone> {
    return this.zonesService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Supprimer une zone par ID' })
  @ApiResponse({ status: 200, description: 'Zone supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Zone non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la zone' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.zonesService.remove(id);
  }
}