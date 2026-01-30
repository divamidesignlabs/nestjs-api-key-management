// Simple logger utility for structured logging

// Basic logger implementation for audit trails and debugging
export class Logger {
  // Logs informational messages with optional structured data
  info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  // Logs operation results with success/failure indication
  logOperation(operation: string, success: boolean, data?: any) {
    const level = success ? 'INFO' : 'ERROR';
    console.log(`[${level}] Operation: ${operation}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Pre-configured logger instance for use throughout the application
export const logger = new Logger();