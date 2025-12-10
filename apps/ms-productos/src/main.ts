import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MsProductos');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // Escucha en todas las interfaces (vital para Docker)
        port: process.env.MS_PRODUCTS_PORT ? parseInt(process.env.MS_PRODUCTS_PORT) : 3002,
      },
    },
  );

  await app.listen();
  logger.log(`Microservice Products is listening on port ${process.env.MS_PRODUCTS_PORT || 3002}`);
}
bootstrap();