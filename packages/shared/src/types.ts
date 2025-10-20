export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryElement {
  id: string;
  type: string;
  content: any;
  position: number;
  storyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryVersion {
  id: string;
  storyId: string;
  version: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VariableDefinition {
  id: string;
  name: string;
  type: string;
  defaultValue: any;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorCodes {
  [key: string]: string;
}