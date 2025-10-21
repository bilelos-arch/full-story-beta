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
  genre: string;
  ageRange: string;
  pdfPath: string;
  coverImagePath?: string;
  status: 'draft' | 'public';
  popularity: number;
  variables: IVariable[];
  elements: IElement[];
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
  genre: { type: String, required: true },
  ageRange: { type: String, required: true },
  pdfPath: { type: String, required: true },
  coverImagePath: { type: String },
  status: { type: String, enum: ['draft', 'public'], default: 'draft' },
  popularity: { type: Number, default: 0 },
  variables: { type: [VariableSchema], default: [] },
  elements: { type: [ElementSchema], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

// Register the sub-schemas
TemplateSchema.add({
  variables: [VariableSchema],
  elements: [ElementSchema],
});