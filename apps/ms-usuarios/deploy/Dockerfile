# 1. IMAGEN BASE "LIGERA"
# Usamos Node.js 20 sobre "Alpine Linux".
# Alpine es un sistema operativo muy pequeño (como una moto en vez de un coche), ideal para que la imagen pese poco.
FROM node:20-alpine

# 2. VARIABLES DE CONSTRUCCIÓN
# Definimos variables para saber qué microservicio estamos construyendo y dónde está su carpeta.
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

# 3. CARPETA DE TRABAJO
# Creamos la carpeta '/app' dentro del contenedor y trabajaremos allí.
WORKDIR /app

# 4. INSTALAR HERRAMIENTAS EXTRA
# Como Alpine viene casi vacío, instalamos a mano lo básico:
# - openssl: Fundamental para conexiones seguras (y para Prisma).
# - git y bash: Para descargar dependencias y ejecutar scripts.
RUN apk add --no-cache openssl git bash

# 5. PREPARAR EL ARRANQUE
# Copiamos el script 'start.sh' a la raíz del contenedor.
COPY ${APP_MS}/deploy/start.sh .

# 6. COPIAR LA ESTRUCTURA (CACHÉ)
# Copiamos primero solo los archivos de configuración (package.json, locks, tsconfig).
# Truco: Si no cambias las dependencias, Docker se salta este paso y la instalación es instantánea.
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# 7. COPIAR EL CÓDIGO REAL
# Ahora copiamos el código fuente de las librerías y de tu microservicio.
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# (Opcional) Esta línea daría permisos de ejecución al script, pero está comentada.
# RUN chmod +x ./start.sh

# 8. PUERTO
# Avisamos de que este contenedor escuchará en el puerto 3000 (típico del Gateway).
EXPOSE 3000

# 9. PERMISOS
# Nos aseguramos de ser usuario 'root' (administrador) para no tener problemas al arrancar.
USER root

# 10. ORDEN DE ARRANQUE
# Ejecutamos el script de inicio usando la consola básica (/bin/sh).
CMD ["/bin/sh", "./start.sh"]

# (Comentado) Este comando 'tail' se usa a veces para mantener el contenedor vivo sin hacer nada si quieres entrar a investigar.
#CMD ["tail", "-f", "/dev/null"]