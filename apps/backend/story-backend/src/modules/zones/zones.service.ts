import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IZone, ZoneSchema } from './zone.schema';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { TemplatesService } from '../templates/templates.service';

@Injectable()
export class ZonesService {
  constructor(
    @InjectModel('Zone') private zoneModel: Model<IZone>,
    private templatesService: TemplatesService,
  ) {}

  async create(createZoneDto: CreateZoneDto): Promise<IZone> {
    // Validate that templateId exists
    await this.templatesService.findOne(createZoneDto.templateId);

    const createdZone = new this.zoneModel({
      ...createZoneDto,
      templateId: new Types.ObjectId(createZoneDto.templateId),
    });
    return createdZone.save();
  }

  async findByTemplateId(templateId: string): Promise<IZone[]> {
    // Validate that templateId exists
    await this.templatesService.findOne(templateId);

    return this.zoneModel.find({ templateId: new Types.ObjectId(templateId) }).exec();
  }

  async update(id: string, updateZoneDto: UpdateZoneDto): Promise<IZone> {
    const updatedZone = await this.zoneModel
      .findByIdAndUpdate(id, updateZoneDto, { new: true })
      .exec();
    if (!updatedZone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }
    return updatedZone;
  }

  async remove(id: string): Promise<void> {
    const result = await this.zoneModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }
  }
}