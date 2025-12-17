# 1. LA BASE LIGERA
# Usamos una versión de Node.js montada sobre 'Alpine Linux'.
# Alpine es un sistema operativo muy pequeñito (ocupa muy poco espacio), ideal para producción.
FROM node:20-alpine

# 2. VARIABLES DE CONSTRUCCIÓN
# Definimos las variables que le pasaremos desde fuera para saber qué microservicio estamos creando.
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

# 3. CARPETA DE TRABAJO
# Creamos la carpeta '/app' y nos metemos dentro.
WORKDIR /app

# 4. INSTALAR HERRAMIENTAS DEL SISTEMA
# Como Alpine es tan minimalista, no trae casi nada instalado.
# Aquí usamos 'apk' (su gestor de paquetes) para instalar cosas básicas que necesitaremos:
# - openssl: Para seguridad y conexiones cifradas (muy importante para Prisma/Base de datos).
# - git: Por si alguna librería necesita descargarse desde GitHub.
# - bash: Una consola más cómoda para ejecutar nuestros scripts.
RUN apk add --no-cache openssl git bash

# 5. EL ARRANQUE
# Copiamos primero el script que encenderá todo, para tenerlo a mano.
COPY ${APP_MS}/deploy/start.sh .

# 6. COPIAR LA CONFIGURACIÓN (LA ESTRUCTURA)
# Copiamos los archivos que definen cómo funciona el proyecto y qué librerías necesita.
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# 7. COPIAR EL CÓDIGO
# Ahora sí, copiamos el código real de las librerías compartidas y del microservicio específico.
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# 8. PUERTO
# Informamos de que este contenedor usará el puerto 3002 (el de productos).
EXPOSE 3002

# 9. PERMISOS
# Nos aseguramos de ser el usuario 'root' (administrador) para no tener problemas de permisos al arrancar.
USER root

# 10. LA ORDEN FINAL
# Arrancamos usando '/bin/sh' (la consola por defecto) para ejecutar el script.
CMD ["/bin/sh", "./start.sh"]