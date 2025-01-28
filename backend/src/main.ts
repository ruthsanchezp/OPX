import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS antes de que la aplicación comience a escuchar
  app.enableCors({
    origin: '*', // Cambiar según las necesidades de seguridad
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Escuchar en el puerto definido por el entorno o usar 3001 como predeterminado
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
