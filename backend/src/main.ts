import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // Habilitar CORS
  await app.listen(process.env.PORT || 3001);  // Usa el puerto del entorno, si existe, sino 3001
}

bootstrap();
