// apps/ms-usuarios/prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // Aquí le dices a la CLI dónde está tu esquema
  schema: 'prisma/schema.prisma',
  // Y AQUÍ es donde ahora se define la URL para migraciones y generación
  datasource: {
    url: process.env.DATABASE_URL, 
  },
  // Opcional: Para habilitar features nuevas si te lo pide
//   earlyAccess: true,
});