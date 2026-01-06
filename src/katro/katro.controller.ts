import { Controller, Get, Post, Body } from '@nestjs/common';
import { KatroService } from './katro.service';
import type { GameState } from './katro.service';

interface PlayDto { row: number; col: number; }

@Controller('katro')
export class KatroController {
  constructor(private readonly service: KatroService) {}

  @Get('state')
  getState(): GameState {
    return this.service.getState();
  }

  @Post('play')
  play(@Body() body: PlayDto): GameState {
    return this.service.play(body.row, body.col);
  }

  @Post('reset')
  reset(): GameState {
    return this.service.reset();
  }
}
