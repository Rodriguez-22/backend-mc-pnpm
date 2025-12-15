FROM node:20-alpine

ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

RUN apk add --no-cache openssl git bash

COPY ${APP_MS}/deploy/start.sh .

# Copiar archivos de configuración del monorepo
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# Copiar código fuente
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# Exponer puerto (el puerto por defecto del microservicio)
EXPOSE 3002
USER root

CMD ["/bin/sh", "./start.sh"]