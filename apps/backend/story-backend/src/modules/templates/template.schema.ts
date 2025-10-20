import { Schema, Document, Types } from 'mongoose';

export interface IVariable {
  name: string;
  type: string;
  defaultValue: any;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface IElement {
  type: string;
  content: string;
  position: IPosition;
  size: ISize;
}

export interface ITemplate extends Document {
  title: string;
  description: string;
  category: string;
  ageRange: string;
  pdfPath: string;
  variables: IVariable[];
  elements: IElement[];
  status: 'draft' | 'public';
  popularity: number;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VariableSchema = new Schema<IVariable>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  defaultValue: { type: Schema.Types.Mixed, required: true },
});

const PositionSchema = new Schema<IPosition>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const SizeSchema = new Schema<ISize>({
  w: { type: Number, required: true },
  h: { type: Number, required: true },
});

const ElementSchema = new Schema<IElement>({
  type: { type: String, required: true },
  content: { type: String, required: true },
  position: { type: PositionSchema, required: true },
  size: { type: SizeSchema, required: true },
});

export const TemplateSchema = new Schema<ITemplate>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ageRange: { type: String, required: true },
  pdfPath: { type: String, required: true },
  variables: [VariableSchema],
  elements: [ElementSchema],
  status: { type: String, enum: ['draft', 'public'], default: 'draft' },
  popularity: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});