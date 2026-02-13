import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  // 1. Cambiamos el contexto del logger
  const logger = new Logger('AuthMicroservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers, // Se mantiene NATS como transporte
      }
    }
  );

  // 2. IMPORTANTE: Añadimos validación global 
  // En Auth es crítico validar que los correos y contraseñas cumplan el formato
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  
  // 3. Ajustamos el mensaje de log con la variable de entorno correspondiente
  logger.log(`Auth Microservice is running and listening via NATS`);
}
bootstrap();