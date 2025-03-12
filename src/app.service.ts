import { Injectable, Logger } from '@nestjs/common';
import { CustomLogger } from './logger/logger.service';

@Injectable()
export class AppService {
  private readonly logger = new CustomLogger();

  getHello(): string {
    this.logger.log('Hello World endpoint called');
    return 'Hello World!';
  }
}
