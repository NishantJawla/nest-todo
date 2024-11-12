import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Decorators associate classes with required metadata and enable Nest to create a routing map (tie requests to the corresponding controllers).

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
