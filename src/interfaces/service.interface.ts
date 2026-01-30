// Service layer interfaces for internal business logic operations

// Parameters for generating a new API key
export interface KeyGenerationParams {
  userId: string; // ID of the service account (client) for whom the key is being generated
  name: string; // Name/description of the API key
  description?: string; // Optional detailed description
  isActive?: boolean; // Active status flag (default: true)
  expiresAt?: Date | null; // Optional expiration date
}

// Result of API key generation operation
export interface KeyGenerationResult {
  keyId: string; // Unique identifier for the generated key
  rawKey: string; // The actual API key value (show only once)
  userId: string; // ID of the service account (client) who owns this key
  createdAt: Date; // Timestamp when the key was created
  expiresAt?: Date | null; // Optional expiration date
  status: string; // Current status of the key
}

// Result of API key validation operation
export interface ValidationResult {
  isValid: boolean; // Whether the API key validation was successful
  reason?: string; // Machine-readable reason code for validation failure
  message: string; // Human-readable message describing the result
  statusCode: number; // HTTP status code for the validation result
  timestamp: string; // ISO timestamp of when validation was performed
  
  // Detailed information about the validated key (only when isValid = true)
  keyInfo?: {
    id: string; // Database ID of the validated key
    userId: string; // ID of the service account (client) who owns the key
    expiresAt?: Date | null; // Expiration date of the key
    status: string; // Current status of the key
  };
  
  details?: any; // Additional details about validation failure
}

export interface ExpirationValidationResult {
  isValid: boolean;
  reason: string;
  message: string;
}

export interface KeyGenerationServiceConfig {
    saltRounds: number;
    maxRetries: number;
    keyPrefix: string;
    defaultExpiryDays: number;
}

export interface UniqueKeyResult {
    rawKey: string;
    keyRecord: {
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date | null;
        status: string;
    };
}