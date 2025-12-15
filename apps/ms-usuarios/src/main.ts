// apps/ms-usuarios/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from '../config/envs'; // Asegúrate de importar desde tu archivo de config

async function bootstrap() {
  const logger = new Logger('MsUsuarios-Main');

  // Usamos MicroserviceOptions para tipado estricto
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // IMPORTANTE: 0.0.0.0 para escuchar en Docker network
        port: envs.port, // Usamos el puerto de las variables de entorno
      },
    },
  );

  // Opcional: Pipes globales si usas validación en los DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Microservicio Usuarios corriendo en puerto ${envs.port} via TCP`);
}
bootstrap();