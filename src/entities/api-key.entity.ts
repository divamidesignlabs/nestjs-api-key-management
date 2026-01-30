// API Key Entity for TypeORM database operations

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { SaInfo } from './sa-info.entity';

// TypeORM entity for API key records in the database
@Entity('api_keys')
export class ApiKey {
  // Primary key for the API key record
  @PrimaryGeneratedColumn()
  id!: number;

  // Name/description of this API key
  @Column()
  name!: string;

  // Foreign key reference to service account info (sa_info table)
  @Column()
  client_id!: string;

  // Relationship to the service account
  @ManyToOne(() => SaInfo)
  @JoinColumn({ name: 'client_id' })
  service_account!: SaInfo;

  // Base64 encoded API key
  @Index('idx_api_key')
  @Column({ unique: true })
  api_key!: string;

  // Expiration date for this API key
  @Column({ type: 'timestamp' })
  expiry_date!: Date;

  // Active status flag for the API key
  @Column({ default: true })
  is_active!: boolean;

  // Timestamp when the API key record was created
  @CreateDateColumn()
  created_at!: Date;

  // Timestamp when the API key record was last updated
  @UpdateDateColumn()
  updated_at!: Date;

  // Identifier of who created this API key
  @Column({ nullable: true })
  created_by!: string;

  // Identifier of who last updated this API key
  @Column({ nullable: true })
  updated_by!: string;

  // Optional description or notes about this API key
  @Column({ nullable: true })
  description!: string;

  // Soft delete timestamp - when this API key was deleted
  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at!: Date | null;

  // Identifier of who deleted this API key
  @Column({ nullable: true })
  deleted_by!: string | null;
}
