// Service Account Info Entity for TypeORM database operations

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiKey } from './api-key.entity';

// TypeORM entity for service account information records in the database
@Entity('sa_info')
export class SaInfo {
  // Primary key using UUID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Foreign key to the user table
  @Column()
  user_id!: number;

  // Base64 encoded random bytes for client secret
  @Column({ unique: true })
  client_secret!: string;

  // Optional description for the service account
  @Column({ nullable: true })
  description!: string;

  // One-to-many relationship with API keys
  @OneToMany(() => ApiKey, (apiKey) => apiKey.service_account)
  api_keys!: ApiKey[];

  // Audit columns - Timestamp when the record was created
  @CreateDateColumn()
  created_at!: Date;

  // Audit columns - Timestamp when the record was last updated
  @UpdateDateColumn()
  updated_at!: Date;

  // Audit columns - Identifier of who created this record
  @Column({ nullable: true })
  created_by!: string;

  // Audit columns - Identifier of who last updated this record
  @Column({ nullable: true })
  updated_by!: string;

  // Soft delete timestamp - when this service account was deleted
  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at!: Date | null;

  // Identifier of who deleted this service account
  @Column({ nullable: true })
  deleted_by!: string | null;
}
