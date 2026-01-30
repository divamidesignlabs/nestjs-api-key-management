// Data Transfer Object interfaces for API requests and responses

// DTO for creating a new API key
export interface CreateApiKeyDto {
  user_id: number;
  name: string;
  description?: string; // Optional human-readable description
  is_active?: boolean; // Optional active status (default: true)
  expires_at?: string; // Optional expiration date in ISO 8601 format
}

// DTO for validating an API key
export interface ValidateApiKeyDto {
  client_id: string; // The client ID from sa_info
  client_secret: string; // The client secret for authentication
  api_key: string; // The API key to validate (format: 'ak_...')
}

// DTO for updating an API key
export interface UpdateApiKeyDto {
  expires_at?: string; // Optional new expiration date in ISO 8601 format
  is_active?: boolean; // Optional active status
}

// DTO for querying/listing API keys
export interface ListKeysQueryDto {
  client_id?: string; // Optional client ID filter
  status?: string; // Optional status filter ('active', 'revoked', 'expired')
  page?: number; // Page number (default: 1)
  limit?: number; // Number of results per page (default: 10, max: 100)
  search?: string; // Search by name or description
  sort_by?: string; // Sort field (default: 'created_at')
  sort_order?: 'ASC' | 'DESC'; // Sort order (default: 'DESC')
  include_deleted?: boolean; // Include soft-deleted records (default: false)
}