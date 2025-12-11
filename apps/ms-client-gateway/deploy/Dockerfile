# Build Stage
FROM node:20

# Argumentos para el contexto de build y el nombre del microservicio
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

# PASO 1: Instalación de herramientas y dependencias (OPTIMIZADO)
# Instalar pnpm globalmente
RUN npm install -g npm@11.6.4 \
    && npm install -g pnpm

RUN pnpm config set global-bin-dir /usr/local/bin
# Copiar archivos de la raíz (necesarios para pnpm install)
# Se asume que el contexto de build es la raíz del monorepo
COPY ${APP_MS}/src ./${APP_MS}/src
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
COPY tsconfig.json ./

# Copiar el nest-cli.json del microservicio
COPY ${APP_MS}/nest-cli.json ./

# Ejecutar pnpm install. Se beneficia del cache si los archivos copiados no cambian.
RUN pnpm install --frozen-lockfile

#cOMANDO PARA INSTALAR PM2
RUN pnpm add -g @nestjs/cli pm2

# PASO 2: Copiar el código del proyecto
# Copiar las librerías compartidas y el microservicio
COPY libs ./libs
COPY ${APP_MS} ${APP_MS}

# Copiar el script de inicio
COPY ${APP_MS}/deploy/start.sh ./

# Asegurar permisos de ejecución
RUN chmod +x ./start.sh

EXPOSE 3000

# Usar ENTRYPOINT para ejecutar el script de inicio del microservicio
ENTRYPOINT [ "./start.sh" ]