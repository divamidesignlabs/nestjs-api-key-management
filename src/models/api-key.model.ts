// API Key Model - Data access layer for API key operations

import { Repository, FindManyOptions } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
import { logger } from '../utils/logger.util';

export type KeyStatus = 'active' | 'expired' | 'revoked' | 'inactive';

interface ApiKeyFilters {
  status?: KeyStatus;
  userId?: number;
  limit?: number;
  offset?: number;
}

// Data model class for API key database operations with TypeORM
export class ApiKeyModel {
  private repository: Repository<ApiKey>;

  constructor(repository: Repository<ApiKey>) {
    this.repository = repository;
  }

  // Update API key status (activate/deactivate) - Used by revokeKey
  async updateStatus(keyId: number, isActive: boolean): Promise<ApiKey | null> {
    try {
      const key = await this.repository.findOne({
        where: { id: keyId }
      });
      
      if (!key) {
        return null;
      }
      
      key.is_active = isActive;
      key.updated_at = new Date();
      
      const updatedKey = await this.repository.save(key);
      
      logger.info('API key status updated', { keyId, isActive });
      
      return updatedKey;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown status update error';
      logger.info('Failed to update API key status', { error: errorMessage, keyId });
      throw new Error(`Failed to update API key status: ${errorMessage}`);
    }
  }

  // Get all API keys with optional filters - Used by listKeys
  async findAll(filters: ApiKeyFilters = {}): Promise<{ keys: ApiKey[]; total: number }> {
    try {
      const whereCondition: any = {};
      
      if (filters.status !== undefined) {
        switch (filters.status) {
          case 'active':
            whereCondition.is_active = true;
            break;
          case 'inactive':
          case 'revoked':
            whereCondition.is_active = false;
            break;
        }
      }
      
      if (filters.userId !== undefined) {
        whereCondition.user_id = filters.userId;
      }
      
      const options: FindManyOptions<ApiKey> = {
        where: whereCondition,
        order: { created_at: 'DESC' }
      };
      
      if (filters.limit !== undefined) {
        options.take = filters.limit;
        
        if (filters.offset !== undefined) {
          options.skip = filters.offset;
        }
      }
      
      const [keys, total] = await this.repository.findAndCount(options);
      
      return { keys, total };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown find all error';
      logger.info('Failed to find API keys', { error: errorMessage });
      throw new Error(`Failed to find API keys: ${errorMessage}`);
    }
  }
}

// Factory function to create ApiKeyModel instances with repository injection
export const createApiKeyModel = (repository: Repository<ApiKey>): ApiKeyModel => {
  return new ApiKeyModel(repository);
};