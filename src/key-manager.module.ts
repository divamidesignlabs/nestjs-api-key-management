// Key Manager Module - NestJS module for API key management

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { SaInfo } from './entities/sa-info.entity';
import { KeyManagerService } from './key-manager.service';

// Main module providing API key management functionality
@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, SaInfo])],
  providers: [KeyManagerService],
  exports: [KeyManagerService, TypeOrmModule],
})
export class KeyManagerModule {}
