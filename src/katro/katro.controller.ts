import { Controller, Get, Post, Body } from '@nestjs/common';
import { KatroService } from './katro.service';

@Controller('katro')
export class KatroController {
  constructor(private readonly service: KatroService) {}

  @Get('state')
  getState() {
    return this.service.getState();
  }

  @Post('play')
  play(@Body() body: { row: number; col: number }) {
    return this.service.play(body.row, body.col);
  }
}
