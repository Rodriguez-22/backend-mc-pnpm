# 1. IMAGEN BASE
FROM node:20-alpine

# 2. VARIABLES DE CONSTRUCCIÓN
ARG CONTEXTO=.
ARG MICROSERVICIO=ms-productos
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

# 4. HERRAMIENTAS
RUN apk add --no-cache openssl git bash

# 5. SCRIPT DE ARRANQUE
COPY ${APP_MS}/deploy/start.sh .
RUN chmod +x ./start.sh

# 6. CONFIGURACIÓN (CACHÉ)
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# 7. CÓDIGO
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# 8. PUERTO (Productos usa el 3002)
EXPOSE 3002

CMD ["./start.sh"]