import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from 'services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return this.appService.getItems();
  }

  @Post()
  post(): void {
   this.appService.createItem();
  }
}
