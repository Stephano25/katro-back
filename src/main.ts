import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser Angular (http://localhost:4200) à communiquer avec NestJS
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST',
  });

  await app.listen(3000);
  console.log('🚀 Katro backend running on http://localhost:3000');
}
bootstrap();
