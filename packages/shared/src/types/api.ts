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
export interface LdrawSubfileRef {
  colorCode: number;
  filename: string;
  transform: number[]; // [x, y, z, a, b, c, d, e, f, g, h, i] — 12 values from spec
}

export interface LdrawLineSegment {
  colorCode: number;
  vertices: number[]; // [x1, y1, z1, x2, y2, z2]
}

export interface LdrawTriangle {
  colorCode: number;
  vertices: number[]; // [x1, y1, z1, ..., x3, y3, z3] — 9 values
}

export interface LdrawQuad {
  colorCode: number;
  vertices: number[]; // [x1, y1, z1, ..., x4, y4, z4] — 12 values
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
