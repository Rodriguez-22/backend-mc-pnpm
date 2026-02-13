import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Importamos el nuevo módulo de autenticación (lo crearemos a continuación)
import { AuthModule } from './auth/auth.module';

// 2. Importamos las entidades relacionadas con la seguridad
// Deberás crear estas entidades en tu librería common o dentro del microservicio
import { User } from '../../../libs/common/src/entities/ms-auth/user.entity';
import { Role } from '../../../libs/common/src/entities/ms-auth/role.entity';

@Module({
  imports: [
    // CONFIGURACIÓN (.env)
    ConfigModule.forRoot({
      isGlobal: true, 
      // Ajustamos la ruta al .env del nuevo microservicio
      envFilePath: 'apps/ms-auth/.env', 
    }),

    // CONEXIÓN A LA BASE DE DATOS (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Asegúrate de tener una base de datos diferente para auth o un esquema distinto
      url: process.env.DATABASE_URL_AUTH || process.env.DATABASE_URL, 
      
      autoLoadEntities: true, 
      
      // Mantenemos synchronize en true para desarrollo, igual que en productos
      synchronize: true, 
      
      // Registramos las tablas de usuarios y roles
      entities: [User, Role],
    }),

    // MÓDULOS DE FUNCIONALIDAD
    // Reemplazamos los módulos de productos por el de Auth
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}