import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GestionUsuariosController } from './modulos/ms-usuarios/usuarios.controller'; // <--- Importa el controlador
import { GestionRolesController } from './modulos/ms-usuarios/roles.controller'; 
import { GestionPermisosController } from './modulos/ms-usuarios/permisos.controller';
import { GatewayProductosController } from './modulos/ms-productos/productos.controller';
import { GatewayCategoriasController } from './modulos/ms-productos/categorias.controller';
import { GatewayAlergenosController } from './modulos/ms-productos/alergenos.controller';
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
  controllers: [AppController, GestionUsuariosController, GestionRolesController, GestionPermisosController, GatewayProductosController, GatewayCategoriasController, GatewayAlergenosController], // <--- Añádelo aquí
  providers: [AppService],
})
export class AppModule {}
