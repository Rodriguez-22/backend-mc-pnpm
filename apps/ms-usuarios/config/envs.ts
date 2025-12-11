import 'dotenv/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'deploy/.env' });


interface EnvVars {
    PORT: number;
    DB_NAME: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DATABASE_URL?: string;
}