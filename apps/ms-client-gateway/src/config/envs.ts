import 'dotenv/config';
import * as joi from 'joi';

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
}

const envVarsSchema = joi.object({
  PORT: joi.number().required(),

  // Users
  MS_USERS_HOST: joi.string().required(),
  MS_USERS_PORT: joi.number().required(),

  // Auth
  MS_AUTH_HOST: joi.string().required(),
  MS_AUTH_PORT: joi.number().required(),

  // Products
  MS_PRODUCTS_HOST: joi.string().required(),
  MS_PRODUCTS_PORT: joi.number().required(),

  // Orders
  MS_ORDERS_HOST: joi.string().required(),
  MS_ORDERS_PORT: joi.number().required(),

  // Tables
  MS_TABLES_HOST: joi.string().required(),
  MS_TABLES_PORT: joi.number().required(),

  // QR Codes
  MS_QRCODES_HOST: joi.string().required(),
  MS_QRCODES_PORT: joi.number().required(),

  // JWT
  JWT_SECRET: joi.string().required(),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  // Microservices URLs
  usersServiceUrl: `http://${envVars.MS_USERS_HOST}:${envVars.MS_USERS_PORT}`,
  authServiceUrl: `http://${envVars.MS_AUTH_HOST}:${envVars.MS_AUTH_PORT}`,
  productsServiceUrl: `http://${envVars.MS_PRODUCTS_HOST}:${envVars.MS_PRODUCTS_PORT}`,
  ordersServiceUrl: `http://${envVars.MS_ORDERS_HOST}:${envVars.MS_ORDERS_PORT}`,
  tablesServiceUrl: `http://${envVars.MS_TABLES_HOST}:${envVars.MS_TABLES_PORT}`,
  qrCodesServiceUrl: `http://${envVars.MS_QRCODES_HOST}:${envVars.MS_QRCODES_PORT}`,

  // JWT
  jwtSecret: envVars.JWT_SECRET,
};