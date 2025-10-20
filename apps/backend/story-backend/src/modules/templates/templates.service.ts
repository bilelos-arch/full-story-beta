import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITemplate, TemplateSchema } from './template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Template') private templateModel: Model<ITemplate>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto, userId: string, pdfPath?: string): Promise<ITemplate> {
    const createdTemplate = new this.templateModel({
      ...createTemplateDto,
      pdfPath: pdfPath,
      createdBy: userId,
    });
    return createdTemplate.save();
  }

  async findAll(): Promise<ITemplate[]> {
    return this.templateModel.find().populate('createdBy').exec();
  }

  async findPopular(limit: number = 4, status: string = 'public', sort: string = 'popularity'): Promise<ITemplate[]> {
    return this.templateModel
      .find({ status })
      .sort({ [sort]: -1 })
      .limit(limit)
      .populate('createdBy')
      .exec();
  }

  async findOne(id: string): Promise<ITemplate> {
    const template = await this.templateModel.findById(id).populate('createdBy').exec();
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<ITemplate> {
    const updatedTemplate = await this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { new: true })
      .populate('createdBy')
      .exec();
    if (!updatedTemplate) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return updatedTemplate;
  }

  async updateStatus(id: string, status: 'draft' | 'public'): Promise<ITemplate> {
    const updatedTemplate = await this.templateModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('createdBy')
      .exec();
    if (!updatedTemplate) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return updatedTemplate;
  }

  async remove(id: string): Promise<void> {
    const result = await this.templateModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }
}