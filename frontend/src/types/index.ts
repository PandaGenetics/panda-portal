"""
TypeScript type definitions
"""

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Dataset types
export interface Dataset {
  id: number;
  name: string;
  description: string | null;
  species: string | null;
  data_type: string | null;
  file_path: string;
  file_size: number | null;
  access_level: string;
  created_at: string;
}

// Genome browser types
export interface GenomeReference {
  id: string;
  name: string;
  description: string;
  fasta_url: string;
  fai_url: string;
  gff_url: string | null;
}

export interface GenomeTrack {
  id: string;
  name: string;
  type: string;
  url: string;
  access_level: string;
}

// BLAST types
export interface BlastJob {
  job_id: number;
  status: string;
  result: string | null;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  data: T[];
}
