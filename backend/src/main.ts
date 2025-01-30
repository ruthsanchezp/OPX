import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS antes de que la aplicación comience a escuchar
  app.enableCors({
    origin: '*', // Cambiar según necesidades de seguridad
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Definir el puerto (por variable de entorno o 3001 por defecto)
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
