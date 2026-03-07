// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// LDraw types
export type LdrawPartType = 'part' | 'subpart' | 'primitive';

export interface LdrawPart {
  filename: string;
  description: string;
  partType: LdrawPartType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LdrawPartSummary {
  filename: string;
  description: string;
  partType: LdrawPartType;
  createdAt: Date;
  updatedAt: Date;
}

// LDraw geometry types (for wireframe rendering)
export interface Vertex {
  x: number;
  y: number;
  z: number;
}

export interface TransformMatrix {
  x: number; y: number; z: number;
  a: number; b: number; c: number;
  d: number; e: number; f: number;
  g: number; h: number; i: number;
}

export interface LdrawSubfileRef {
  colorCode: number;
  filename: string;
  transform: TransformMatrix;
}

export interface LdrawLineSegment {
  colorCode: number;
  v1: Vertex;
  v2: Vertex;
}

export interface LdrawTriangle {
  colorCode: number;
  v1: Vertex;
  v2: Vertex;
  v3: Vertex;
}

export interface LdrawQuad {
  colorCode: number;
  v1: Vertex;
  v2: Vertex;
  v3: Vertex;
  v4: Vertex;
}

export interface LdrawPartGeometry {
  filename: string;
  subfileRefs: LdrawSubfileRef[];
  lines: LdrawLineSegment[];
  triangles: LdrawTriangle[];
  quads: LdrawQuad[];
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
