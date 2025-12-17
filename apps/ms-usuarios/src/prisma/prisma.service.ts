import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // El cliente automático que genera Prisma
import { PrismaPg } from '@prisma/adapter-pg'; // El adaptador especial para usar el driver 'pg'
import { Pool } from 'pg'; // El driver estándar de PostgreSQL para Node.js

@Injectable() // Permite que este servicio se pueda "inyectar" en otros sitios (Controladores, Servicios...)
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  // 1. CONSTRUCTOR (CONFIGURACIÓN ESPECIAL)
  // Aquí es donde "trucamos" a Prisma para que use nuestra propia conexión.
  constructor() {
    // Leemos la dirección de la base de datos del archivo .env
    const connectionString = process.env.DATABASE_URL;
    console.log('Conectando a DB:', connectionString); // Aviso en consola para saber qué está pasando

    // Creamos una "Piscina" (Pool) de conexiones usando el driver 'pg'.
    // Una Pool gestiona muchas conexiones a la vez para que la app sea rápida.
    const pool = new Pool({ connectionString });
    
    // Creamos el adaptador. Es como un traductor que le permite a Prisma usar esa Pool.
    const adapter = new PrismaPg(pool);
    
    // Llamamos al constructor del padre (PrismaClient) pasándole nuestro adaptador.
    // Le decimos: "Oye Prisma, no uses tu motor por defecto, usa este adaptador que he creado".
    super({ adapter });
  }

  // 2. AL ARRANCAR (ENCENDIDO)
  // Se ejecuta automáticamente cuando NestJS inicia este módulo.
  async onModuleInit() {
    // Conectamos a la base de datos.
    await this.$connect();
  }

  // 3. AL CERRAR (APAGADO)
  // Se ejecuta automáticamente cuando apagas la aplicación.
  async onModuleDestroy() {
    // Desconectamos ordenadamente para no dejar conexiones "zombis" abiertas.
    await this.$disconnect();
  }
}