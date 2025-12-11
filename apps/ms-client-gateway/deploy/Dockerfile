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

# Copiar el archivo de configuración que SÍ existe (tsconfig.build.json)
COPY tsconfig.build.json ./

# Si existe, también debes copiar el tsconfig.json de la app específica
# Si no lo tienes, este paso se puede omitir o reemplazar por el build.json
# COPY ${APP_MS}/tsconfig.app.json ${APP_MS}/ 

# Copiar el nest-cli.json
COPY nest-cli.json ./

# Ejecutar pnpm install.
RUN pnpm install --frozen-lockfile

# Instalar PM2 y NEST CLI globalmente
RUN pnpm add -g @nestjs/cli pm2

# PASO 2: Copiar el código del proyecto
# Copiar las librerías compartidas (CRUCIAL para pnpm build)
COPY libs ./libs

# Copiar archivos fuente del microservicio
COPY ${APP_MS}/src ./${APP_MS}/src 

# --------------------------------------------------------------------------
# PASO 3: COMPILACIÓN DEL CÓDIGO (¡EL PASO CLAVE!)
# Usamos el comando de build de pnpm para generar el código JavaScript en 'dist'.
# --------------------------------------------------------------------------
RUN pnpm build ${MICROSERVICIO} 

# PASO 4: Preparación final y ejecución
# Copiar el script de inicio
COPY ${APP_MS}/deploy/start.sh ./

# Asegurar permisos de ejecución
RUN chmod +x ./start.sh

EXPOSE 3000

# Usar ENTRYPOINT para ejecutar el script de inicio del microservicio
ENTRYPOINT [ "./start.sh" ]