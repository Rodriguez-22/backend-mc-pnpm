import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GestionUsuariosController } from './modulos/ms-usuarios/usuarios.controller'; // <--- Importa el controlador
import { MS_USERS } from './config/service'; // O usa 'MS_USERS' directo

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_USERS, // Debe coincidir con el @Inject del controlador
        transport: Transport.TCP,
        options: {
          host: process.env.MS_USERS_HOST || 'localhost', // O el nombre del servicio en Docker 'ms-usuarios'
          port: parseInt(process.env.MS_USERS_PORT || '3001'), // Puerto donde escucha ms-usuarios
        },
      },
    ]),
  ],
  controllers: [AppController, GestionUsuariosController], // <--- Añádelo aquí
  providers: [AppService],
})
export class AppModule {}
