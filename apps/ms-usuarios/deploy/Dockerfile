# Build Stage
FROM node:20

# Argumentos para el contexto de build y el nombre del microservicio
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

# PASO 1: Instalación de herramientas y dependencias
RUN npm install -g npm@11.6.4 \
    && npm install -g pnpm

RUN pnpm config set global-bin-dir /usr/local/bin

# 1.1 Copiar archivos de configuración de la RAÍZ
# Es importante incluir pnpm-workspace.yaml si existe
COPY package.json pnpm-lock.yaml .npmrc tsconfig.json nest-cli.json pnpm-workspace.yaml ./

# 1.2 [CRÍTICO] Copiar el package.json del MICROSERVICIO antes del install
# Sin esto, pnpm ignora las dependencias de este módulo (como bcrypt)
COPY ${APP_MS}/package.json ./${APP_MS}/

# 1.3 Instalar todas las dependencias
RUN pnpm install --frozen-lockfile

# Instalar herramientas globales necesarias
RUN pnpm add -g @nestjs/cli pm2

# PASO 2: Generar Cliente de Prisma (Necesario para que TypeScript reconozca los tipos)
COPY ${APP_MS}/prisma ./${APP_MS}/prisma
RUN npx prisma generate --schema=./${APP_MS}/prisma/schema.prisma

# PASO 3: Copiar el código fuente
COPY ${APP_MS}/src ./${APP_MS}/src
COPY ${APP_MS}/tsconfig.build.json ./${APP_MS}/

# Copiar librerías compartidas
COPY libs ./libs

# PASO 4: Script de inicio
COPY ${APP_MS}/deploy/start.sh ./
RUN chmod +x ./start.sh

EXPOSE 3001

# Usar ENTRYPOINT para ejecutar el script de inicio del microservicio
ENTRYPOINT [ "./start.sh" ]