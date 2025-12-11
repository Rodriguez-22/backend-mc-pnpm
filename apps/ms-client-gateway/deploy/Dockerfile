# Build Stage
FROM node:20

# Argumentos para el contexto de build y el nombre del microservicio
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

# PASO 1: Instalación de herramientas y dependencias (OPTIMIZADO)
RUN npm install -g npm@11.6.4 \
    && npm install -g pnpm

RUN pnpm config set global-bin-dir /usr/local/bin

# --------------------------------------------------------------------------
# COPIA DE ARCHIVOS BASE DEL MONOREPO (NECESARIOS PARA INSTALL Y BUILD)
# --------------------------------------------------------------------------
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

# Ejecutar pnpm install.
RUN pnpm install --frozen-lockfile

# Instalar PM2 y NEST CLI globalmente
RUN pnpm add -g @nestjs/cli pm2

# PASO 2: Copiar el código del proyecto y sus configuraciones
COPY libs ./libs

# Copiar archivos fuente del microservicio
COPY ${APP_MS}/src ./${APP_MS}/src 

# --------------------------------------------------------------------------
# PASO 3: COMPILACIÓN DEL CÓDIGO (¡CORRECCIÓN CLAVE!)
# Forzamos a 'nest build' a usar el tsconfig.build.json de la app.
# --------------------------------------------------------------------------
RUN nest build ${MICROSERVICIO} --config ${APP_MS}/tsconfig.build.json 

# PASO 4: Preparación final y ejecución
# Copiar el script de inicio
COPY ${APP_MS}/deploy/start.sh ./

# Asegurar permisos de ejecución
RUN chmod +x ./start.sh

EXPOSE 3000

# Usar ENTRYPOINT para ejecutar el script de inicio del microservicio
ENTRYPOINT [ "./start.sh" ]