import { Module } from '@nestjs/common';
import { KatroController } from './katro.controller';
import { KatroService } from './katro.service';

@Module({
  controllers: [KatroController],
  providers: [KatroService],
})
export class KatroModule {}
