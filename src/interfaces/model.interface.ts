// Model layer interfaces defining data structure for database operations

// Represents an API key record as stored in the database
export interface ApiKeyRecord {
  id: string; // Unique identifier for the API key record
  user_id: number; // ID of the user who owns this API key
  permissions: string[] | string; // Permissions (array or JSON string)
  comments?: string; // Optional human-readable comments for the API key
  created_at: Date; // Timestamp when the API key was created
  expires_at: Date | null; // Expiration date (null if no expiration)
  status: string; // Current status ('active', 'revoked', 'expired', 'inactive')
}