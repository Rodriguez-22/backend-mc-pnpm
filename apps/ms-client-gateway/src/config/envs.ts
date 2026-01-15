import 'dotenv/config';
import * as joi from 'joi';
import { env } from 'process';

interface EnvVars {
  PORT: number;

  // Microservices - Users
  MS_USERS_HOST: string;
  MS_USERS_PORT: number;

  // Microservices - Auth
  MS_AUTH_HOST: string;
  MS_AUTH_PORT: number;

  // Microservices - Products
  MS_PRODUCTS_HOST: string;
  MS_PRODUCTS_PORT: number;

  // Microservices - Orders
  MS_ORDERS_HOST: string;
  MS_ORDERS_PORT: number;

  // Microservices - Tables
  MS_TABLES_HOST: string;
  MS_TABLES_PORT: number;

  // Microservices - QR Codes
  MS_QRCODES_HOST: string;
  MS_QRCODES_PORT: number;

  // JWT
  JWT_SECRET: string;

  //
  NATS_SERVERS: string[];
}

// ... (imports e interface se mantienen igual)

const envVarsSchema = joi.object({
  PORT: joi.number().required(),

  // Servicios que SÍ tienes (obligatorios)
  MS_USERS_HOST: joi.string().required(),
  MS_USERS_PORT: joi.number().required(),
  MS_PRODUCTS_HOST: joi.string().required(),
  MS_PRODUCTS_PORT: joi.number().required(),

  // Servicios que NO tienes aún (hazlos opcionales quitando el .required())
  MS_AUTH_HOST: joi.string(),
  MS_AUTH_PORT: joi.number(),
  MS_ORDERS_HOST: joi.string(),
  MS_ORDERS_PORT: joi.number(),
  MS_TABLES_HOST: joi.string(),
  MS_TABLES_PORT: joi.number(),
  MS_QRCODES_HOST: joi.string(),
  MS_QRCODES_PORT: joi.number(),

  // Otros requerimientos
  JWT_SECRET: joi.string().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

// --- PROTECCIÓN PARA EL SPLIT ---
const rawNatsServers = process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : [];

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: rawNatsServers
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  // Microservices URLs (Usa valores por defecto si no existen para evitar URLs vacías)
  usersServiceUrl: `http://${envVars.MS_USERS_HOST}:${envVars.MS_USERS_PORT}`,
  productsServiceUrl: `http://${envVars.MS_PRODUCTS_HOST}:${envVars.MS_PRODUCTS_PORT}`,
  
  authServiceUrl: envVars.MS_AUTH_HOST ? `http://${envVars.MS_AUTH_HOST}:${envVars.MS_AUTH_PORT}` : null,
  ordersServiceUrl: envVars.MS_ORDERS_HOST ? `http://${envVars.MS_ORDERS_HOST}:${envVars.MS_ORDERS_PORT}` : null,
  tablesServiceUrl: envVars.MS_TABLES_HOST ? `http://${envVars.MS_TABLES_HOST}:${envVars.MS_TABLES_PORT}` : null,
  qrCodesServiceUrl: envVars.MS_QRCODES_HOST ? `http://${envVars.MS_QRCODES_HOST}:${envVars.MS_QRCODES_PORT}` : null,

  jwtSecret: envVars.JWT_SECRET,
  natsServers: envVars.NATS_SERVERS,
};