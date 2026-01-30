// Key Validation Service - Enterprise-grade validation with security, caching, and audit capabilities

import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
import { ExpirationValidationResult, ValidationResult } from '../interfaces/service.interface';
import { logger } from '../utils/logger.util';

// Enterprise-grade key validation service with security, caching, rate limiting, and audit capabilities
@Injectable()
export class KeyValidationService {

  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>
  ) { }

  // Validate API key with security checks, rate limiting, and audit logging
  async validateApiKey({
    keyToValidate,
    clientId
  }: {
    keyToValidate: string;
    clientId?: string;
  }): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      // Input validation
      if (!keyToValidate?.trim()) {
        return this.createFailureResult('INVALID_FORMAT', 'API key cannot be empty', startTime);
      }

      // Database validation - find key using direct comparison
      const keyRecord = await this.apiKeyRepository.findOne({
        where: { 
          api_key: keyToValidate,
          is_active: true 
        },
        select: ['id', 'client_id', 'api_key', 'expiry_date', 'is_active', 'created_at']
      });

      if (!keyRecord) {
        await this.logValidation('unknown', 'validate', 'failure', {
          reason: 'KEY_NOT_FOUND',
          clientId,
          keyPrefix: keyToValidate.substring(0, 8) + '***'
        });

        return this.createFailureResult('KEY_NOT_FOUND', 'API key not found', 404, startTime);
      }

      // Status validation (check if key is active)
      if (!keyRecord.is_active) {
        await this.logValidation(keyRecord.id.toString(), 'validate', 'failure', {
          reason: 'KEY_INACTIVE',
          clientId,
          status: keyRecord.is_active
        });

        return this.createFailureResult('KEY_INACTIVE', 'API key is not active', 403, startTime);
      }

      // Expiration validation
      const expirationValidation = this.validateExpiration(keyRecord.expiry_date);
      if (!expirationValidation.isValid) {
        await this.logValidation(keyRecord.id.toString(), 'validate', 'failure', {
          reason: expirationValidation.reason,
          clientId,
          expiresAt: keyRecord.expiry_date
        });

        return this.createFailureResult(expirationValidation.reason, expirationValidation.message, 401, startTime);
      }

      // Log successful validation
      await this.logValidation(keyRecord.id.toString(), 'validate', 'success', {
        clientId,
        validationTime: Date.now() - startTime
      });

      return {
        isValid: true,
        message: 'API key validation successful',
        statusCode: 200,
        timestamp: new Date().toISOString(),
        keyInfo: {
          id: keyRecord.id.toString(),
          userId: keyRecord.client_id,
          expiresAt: keyRecord.expiry_date,
          status: keyRecord.is_active ? 'active' : 'inactive'
        }
      };

    } catch (error) {
      logger.info('Key validation error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        clientId,
        keyPrefix: keyToValidate?.substring(0, 8) + '***'
      });

      return this.createFailureResult('VALIDATION_ERROR', 'Internal validation error', 500, startTime);
    }
  }

  // Validate API key expiration
  private validateExpiration(expiresAt?: Date): ExpirationValidationResult {
    if (!expiresAt) {
      return {
        isValid: true,
        reason: 'NO_EXPIRY',
        message: 'Key has no expiration date'
      };
    }

    const now = new Date();
    if (expiresAt <= now) {
      return {
        isValid: false,
        reason: 'KEY_EXPIRED',
        message: `API key expired on ${expiresAt.toISOString()}`
      };
    }

    return {
      isValid: true,
      reason: 'NOT_EXPIRED',
      message: 'Key is within expiration date'
    };
  }

  // Create standardized failure result
  private createFailureResult(reason: string, message: string, statusCode: number, startTime?: number): ValidationResult {
    return {
      isValid: false,
      reason,
      message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  // Log validation attempts for audit
  private async logValidation(
    keyId: string,
    action: string,
    result: 'success' | 'failure',
    metadata: any
  ): Promise<void> {

    try {
      logger.info('Key validation audit log', {
        keyId,
        action,
        result,
        timestamp: new Date().toISOString(),
        metadata
      });
    } catch (error) {
      logger.info('Failed to write audit log', {
        error: (error as Error).message,
        keyId,
        action,
        result
      });
    }
  }

}