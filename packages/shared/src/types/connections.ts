// Base connection type - will be extended via PRs
export interface BaseConnection {
  type: ConnectionType;
  description?: string;
}

// Initial connection types (stud/anti-stud)
export enum ConnectionType {
  STUD = 'stud',
  ANTI_STUD = 'anti_stud',
  // More types added via PRs: TECHNIC_PIN, CLIP, etc.
}

// Stud connection (empty for now - community will define via PRs)
export interface StudConnection extends BaseConnection {
  type: ConnectionType.STUD;
  // Properties TBD by community
}

// Anti-stud connection (empty for now)
export interface AntiStudConnection extends BaseConnection {
  type: ConnectionType.ANTI_STUD;
  // Properties TBD by community
}

// Union type for all connection types
export type Connection = StudConnection | AntiStudConnection;

// Part specification
export interface PartSpec {
  partNumber?: string;
  name: string;
  description?: string;
}

// Connection specification (what gets stored in DB)
export interface ConnectionSpec {
  id: string;
  partId: string;
  connections: Connection[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  voteCount: number; // Computed: upvotes - downvotes
}
