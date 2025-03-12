import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger;

  constructor() {
    const logDir = process.env.LOG_DIR || 'logs';
    const retentionDays = process.env.LOG_RETENTION_DAYS || '7';

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} ${level}: ${message}`,
        ),
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          filename: path.join(logDir, 'application-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxFiles: `${retentionDays}d`,
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
