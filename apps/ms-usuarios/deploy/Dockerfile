FROM node:20-alpine

ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

RUN apk add --no-cache openssl

COPY ${APP_MS}/deploy/start.sh .
# Copiar archivos de configuración
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# Copiar código fuente
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# RUN chmod +x ./start.sh

# Exponer puerto
EXPOSE 3000
USER root

# CMD ["./start.sh"]
CMD ["tail", "-f", "/dev/null"]