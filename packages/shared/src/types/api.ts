import { ConnectionSpec, PartSpec } from './connections';

// User types
export interface User {
  id: string;
  githubId: string;
  githubUsername: string;
  avatarUrl?: string;
  createdAt: Date;
}

// Part types
export interface Part {
  id: string;
  name: string;
  partNumber?: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreatePartRequest {
  name: string;
  partNumber?: string;
  description?: string;
}

// Connection spec types
export interface CreateConnectionSpecRequest {
  partId: string;
  connections: any[]; // Will be validated against Connection type
}

export interface UpdateConnectionSpecRequest {
  connections: any[]; // Will be validated against Connection type
}

// Vote types
export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

export interface Vote {
  id: string;
  connectionSpecId: string;
  userId: string;
  voteType: VoteType;
  createdAt: Date;
}

export interface VoteRequest {
  voteType: VoteType;
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

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
