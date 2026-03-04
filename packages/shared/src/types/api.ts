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

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
