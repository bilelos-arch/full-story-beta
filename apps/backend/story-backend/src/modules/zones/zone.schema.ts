import { Schema, Document, Types } from 'mongoose';

export interface IPosition {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export enum ZoneType {
  TEXT = 'text',
  IMAGE = 'image',
  VARIABLE = 'variable',
}

export interface IZone extends Document {
  templateId: Types.ObjectId;
  name: string;
  type: ZoneType;
  variables: string[];
  content: string;
  position: IPosition;
  size: ISize;
}

const PositionSchema = new Schema<IPosition>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const SizeSchema = new Schema<ISize>({
  w: { type: Number, required: true },
  h: { type: Number, required: true },
});

export const ZoneSchema = new Schema<IZone>({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(ZoneType), required: true },
  variables: [{ type: String }],
  content: { type: String, required: true },
  position: { type: PositionSchema, required: true },
  size: { type: SizeSchema, required: true },
}, {
  timestamps: true,
});