# Key Manager Library Usage

This library provides comprehensive API key management functionality for NestJS applications.

## Installation

```bash
npm install key-manager-lib
```

## Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { KeyManagerModule } from 'key-manager-lib';

@Module({
  imports: [KeyManagerModule],
})
export class AppModule {}
```

## Usage Examples

### 1. Create an API Key

```typescript
import { Controller, Post, Body, Req } from '@nestjs/common';
import { KeyManagerService, CreateApiKeyDto } from 'key-manager-lib';
import { Request } from 'express';

@Controller('api/keys')
export class KeyController {
  constructor(private readonly keyManager: KeyManagerService) {}

  @Post()
  async createKey(@Body() createKeyDto: CreateApiKeyDto, @Req() req: Request) {
    return await this.keyManager.createApiKey(createKeyDto, req);
  }
}
```

**Request Body:**
```json
{
  "user_id": 123,
  "name": "Production API Key",
  "description": "API key for production environment",
  "is_active": true,
  "expires_at": "2027-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "key_id": 1,
    "raw_key": "aGVsbG93b3JsZGJhc2U2NGVuY29kZWRrZXk=",
    "user_id": 123,
    "client_id": "550e8400-e29b-41d4-a716-446655440000",
    "client_secret": "bXlzZWNyZXRiYXNlNjRlbmNvZGVkc3RyaW5n",
    "name": "Production API Key",
    "description": "API key for production environment",
    "is_active": true,
    "created_at": "2026-01-30T10:00:00.000Z",
    "expires_at": "2027-12-31T23:59:59.000Z",
    "status": "active"
  },
  "timestamp": "2026-01-30T10:00:00.000Z"
}
```

**Important:** The `client_secret` is only returned when creating the first API key for a user (when the service account is created). Store it securely as you'll need it for API key validation.

### 2. Validate an API Key

```typescript
@Post('validate')
async validateKey(@Body() validateKeyDto: ValidateApiKeyDto) {
  return await this.keyManager.validateKey(validateKeyDto);
}
```

**Request Body:**
```json
{
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "client_secret": "bXlzZWNyZXRiYXNlNjRlbmNvZGVkc3RyaW5n",
  "api_key": "aGVsbG93b3JsZGJhc2U2NGVuY29kZWRrZXk="
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "API key is valid",
  "code": "KEY_VALID",
  "data": {
    "key_id": 1,
    "user_id": 123,
    "client_id": "550e8400-e29b-41d4-a716-446655440000",
    "expires_at": "2027-12-31T23:59:59.000Z",
    "status": "active"
  },
  "timestamp": "2026-01-30T10:00:00.000Z"
}
```

### 3. Update an API Key

```typescript
@Put(':id')
async updateKey(@Param('id') id: string, @Body() updateKeyDto: UpdateApiKeyDto) {
  return await this.keyManager.updateApiKey(id, updateKeyDto);
}
```

**Request Body:**
```json
{
  "expires_at": "2028-12-31T23:59:59.000Z",
  "is_active": false
}
```

### 4. Remove an API Key (Soft Delete)

```typescript
@Delete(':id')
async removeKey(@Param('id') id: string) {
  return await this.keyManager.removeKey(id);
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key removed successfully",
  "data": {
    "key_id": 1,
    "client_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "deleted",
    "deleted_at": "2026-01-30T10:00:00.000Z",
    "deleted_by": "key-manager-service"
  },
  "timestamp": "2026-01-30T10:00:00.000Z"
}
```

### 5. List API Keys

```typescript
@Get()
async listKeys(@Query() query: ListKeysQueryDto, @Req() req: Request) {
  return await this.keyManager.listKeys(query, req);
}
```

**Query Parameters:**
- `client_id` (optional): Filter by client ID (service account UUID)
- `status` (optional): Filter by status ('active', 'inactive', 'expired', 'deleted')
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)
- `search` (optional): Search by name or description (case-insensitive)
- `sort_by` (optional): Sort field ('created_at', 'updated_at', 'expiry_date', 'name', 'is_active')
- `sort_order` (optional): Sort order ('ASC' or 'DESC', default: 'DESC')
- `include_deleted` (optional): Include soft-deleted keys (default: false)

**Example Request:**
```
GET /api/keys?client_id=550e8400-e29b-41d4-a716-446655440000&status=active&page=1&limit=20&search=production&sort_by=created_at&sort_order=DESC
```

**Response:**
```json
{
  "success": true,
  "message": "API keys retrieved successfully",
  "data": {
    "keys": [
      {
        "id": 1,
        "client_id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Production API Key",
        "description": "API key for production environment",
        "created_at": "2026-01-30T10:00:00.000Z",
        "expires_at": "2027-12-31T23:59:59.000Z",
        "status": "active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "total_pages": 3,
      "has_next": true,
      "has_previous": false
    }
  },
  "timestamp": "2026-01-30T10:00:00.000Z"
}
```

## Error Handling

All methods return structured error responses with appropriate HTTP status codes:

```json
{
  "error": "Bad Request",
  "message": "expires_at must be in the future",
  "code": "EXPIRY_DATE_PAST",
  "timestamp": "2025-12-12T10:00:00.000Z"
}
```

## Features

- ✅ Secure API key generation using base64 encoding
- ✅ Service account management with client credentials (client_id + client_secret)
- ✅ Two-tier architecture: Users → Service Accounts → API Keys
- ✅ API key validation with client credential authentication
- ✅ Soft delete functionality for keys and service accounts
- ✅ Advanced pagination with page/limit parameters
- ✅ Search functionality by name or description
- ✅ Flexible sorting options
- ✅ Comprehensive filtering (status, client_id, deleted keys)
- ✅ API key update (expiry date and active status)
- ✅ Detailed logging and audit trails
- ✅ Error handling with structured responses
- ✅ TypeScript support with full type definitions
- ✅ Integration with NestJS and TypeORM

## Important Notes

1. **Service Account Creation**: When creating the first API key for a user, a service account (sa_info) is automatically created with a `client_id` (UUID) and `client_secret` (base64 encoded)
2. **Client Credentials**: The `client_secret` is only returned once during service account creation - store it securely as it's required for API key validation
3. **API Keys**: The `raw_key` is only returned during key creation - store it securely as it cannot be retrieved later
4. **Validation Flow**: To validate an API key, you must provide the `client_id`, `client_secret`, and `api_key` together
5. **Soft Delete**: Removed keys are soft-deleted (marked with `deleted_at`) and excluded from listings by default. Use `include_deleted=true` to view them
6. **Key Reuse**: Multiple API keys can be created for the same user using the same service account (same client_id)
7. **Key Format**: API keys are base64 encoded random bytes (32 bytes)
8. **Pagination**: Default pagination is 10 items per page, maximum 100 items per page
9. **Timestamps**: All timestamps are in ISO 8601 format
10. **Error Details**: Environment-specific error details are only shown in development mode

## Architecture

```
User (user_id: 123)
  └─> Service Account (sa_info)
       ├─> client_id: "550e8400-e29b-41d4-a716-446655440000" (UUID)
       ├─> client_secret: "base64_encoded_secret"
       └─> API Keys
            ├─> API Key 1 (name: "Production")
            ├─> API Key 2 (name: "Development")
            └─> API Key 3 (name: "Testing")
```

Each user has one service account, which can have multiple API keys. Authentication requires both the service account credentials (client_id + client_secret) and the API key.