
// Comprehensive logging system
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  constructor() {
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    // Add to in-memory store
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    return entry;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    const levelName = levelNames[entry.level];
    
    let formatted = `[${entry.timestamp}] ${levelName}: ${entry.message}`;
    
    if (entry.context) {
      formatted += ` | Context: ${JSON.stringify(entry.context)}`;
    }
    
    if (entry.error) {
      formatted += ` | Error: ${entry.error.name} - ${entry.error.message}`;
      if (entry.error.stack && entry.level === LogLevel.ERROR) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }
    
    return formatted;
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, context);
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    
    console.error(this.formatLogEntry(entry));
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    console.warn(this.formatLogEntry(entry));
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    console.info(this.formatLogEntry(entry));
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    console.debug(this.formatLogEntry(entry));
  }

  // API request logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    ip?: string,
    userAgent?: string
  ): void {
    const entry = this.createLogEntry(LogLevel.INFO, `${method} ${url}`, {
      statusCode,
      responseTime: `${responseTime}ms`,
      userId,
      ip,
      userAgent,
    });
    
    entry.method = method;
    entry.url = url;
    entry.statusCode = statusCode;
    entry.responseTime = responseTime;
    entry.userId = userId;
    entry.ip = ip;
    entry.userAgent = userAgent;
    
    console.info(this.formatLogEntry(entry));
  }

  // Security event logging
  logSecurityEvent(
    event: string,
    details: Record<string, any>,
    userId?: string,
    ip?: string
  ): void {
    const entry = this.createLogEntry(LogLevel.WARN, `SECURITY: ${event}`, {
      ...details,
      userId,
      ip,
    });
    
    entry.userId = userId;
    entry.ip = ip;
    
    console.warn(this.formatLogEntry(entry));
  }

  // Performance logging
  logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ): void {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
    const entry = this.createLogEntry(level, `PERFORMANCE: ${operation}`, {
      duration: `${duration}ms`,
      ...context,
    });
    
    if (level === LogLevel.WARN) {
      console.warn(this.formatLogEntry(entry));
    } else {
      console.debug(this.formatLogEntry(entry));
    }
  }

  // Get recent logs (for admin dashboard)
  getRecentLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
    return this.logs
      .filter(log => log.level === level)
      .slice(-limit);
  }

  // Get error logs
  getErrorLogs(limit: number = 50): LogEntry[] {
    return this.getLogsByLevel(LogLevel.ERROR, limit);
  }

  // Get security logs
  getSecurityLogs(limit: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.message.startsWith('SECURITY:'))
      .slice(-limit);
  }

  // Clear logs (for testing or maintenance)
  clearLogs(): void {
    this.logs = [];
  }

  // Get log statistics
  getLogStats(): {
    total: number;
    byLevel: Record<string, number>;
    recentErrors: number;
    recentSecurity: number;
  } {
    const byLevel = this.logs.reduce((acc, log) => {
      const levelName = ['ERROR', 'WARN', 'INFO', 'DEBUG'][log.level];
      acc[levelName] = (acc[levelName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentErrors = this.logs.filter(
      log => log.level === LogLevel.ERROR && log.timestamp > oneHourAgo
    ).length;
    
    const recentSecurity = this.logs.filter(
      log => log.message.startsWith('SECURITY:') && log.timestamp > oneHourAgo
    ).length;

    return {
      total: this.logs.length,
      byLevel,
      recentErrors,
      recentSecurity,
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Request logging middleware helper
export function createRequestLogger() {
  return (
    method: string,
    url: string,
    statusCode: number,
    startTime: number,
    userId?: string,
    ip?: string,
    userAgent?: string
  ) => {
    const responseTime = Date.now() - startTime;
    logger.logRequest(method, url, statusCode, responseTime, userId, ip, userAgent);
  };
}

// Performance measurement helper
export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now();
  
  return fn().then(
    result => {
      const duration = Date.now() - startTime;
      logger.logPerformance(operation, duration, context);
      return result;
    },
    error => {
      const duration = Date.now() - startTime;
      logger.logPerformance(`${operation} (FAILED)`, duration, context);
      throw error;
    }
  );
}
