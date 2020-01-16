import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { RegisterModel } from '../models/register.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AppService } from 'services/app.service';

@Controller('api/account')
export class AccountController {
  constructor(private service: AppService) {}
  @Post('register')
  register(
    @Body(new ValidationPipe())
    body: RegisterModel,
  ) {
    return this.service.onRegister(body);
  }
}
