import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { ZoneSchema } from './zone.schema';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Zone', schema: ZoneSchema }]),
    TemplatesModule,
  ],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}