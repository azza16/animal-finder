import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(@Res() response): void {
    response.sendFile(join(__dirname, '..', 'client/index.html'));
  }
}
