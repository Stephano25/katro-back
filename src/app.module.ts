import { Module } from '@nestjs/common';
import { KatroModule } from './katro/katro.module';

@Module({
  imports: [KatroModule],
})
export class AppModule {}
