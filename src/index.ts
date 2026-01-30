// Key Manager Library - Main exports

// Core exports
export * from './key-manager.module';
export * from './key-manager.service';
export * from './entities/api-key.entity';
export * from './entities/sa-info.entity';

// Interface exports
export * from './interfaces/dto.interface';
export * from './interfaces/service.interface';
export * from './interfaces/model.interface';

// Service exports
export * from './services/key-generation.service';
export * from './services/key-validation.service';
export * from './models/api-key.model';
export * from './utils/logger.util';

// Library constants
export const KEY_MANAGER_LIB_VERSION = '1.0.0';

export const SUPPORTED_FEATURES = [
  'key-generation',
  'key-validation', 
  'key-revocation',
  'key-listing',
  'permission-checking',
  'pagination',
  'audit-logging',
  'request-tracking',
] as const;

export const DEFAULT_CONFIG = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  DEFAULT_KEY_EXPIRY_MS: 365 * 24 * 60 * 60 * 1000,
  KEY_PREFIX: 'ak_',
  KEY_ENTROPY_BYTES: 32,
} as const;
