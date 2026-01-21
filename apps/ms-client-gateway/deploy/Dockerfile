FROM node:20-alpine

# Argumentos
ARG MICROSERVICIO
# Ruta relativa dentro del monorepo
ENV APP_DIR=apps/${MICROSERVICIO}

# 1. Instalamos herramientas (Añadimos openssh-client y bash)
RUN apk update && apk add --no-cache git openssh-client bash \
    && npm install -g pnpm pm2

# 2. Directorio de trabajo (Raíz del monorepo)
WORKDIR /app

# 3. COPIA SEGURA: 
# Copiamos el script fuera de /app para que el volumen no lo borre
COPY apps/${MICROSERVICIO}/deploy/start.sh /usr/local/bin/start-app.sh

# 4. Permisos y limpieza de formato Windows (CRLF)
RUN chmod +x /usr/local/bin/start-app.sh && \
    sed -i 's/\r$//' /usr/local/bin/start-app.sh

# 5. Logs y exposición
RUN mkdir -p /root/logs
EXPOSE 3000

# 6. Nos situamos en la carpeta del microservicio antes de ejecutar
WORKDIR /app/${APP_DIR}

# 7. EJECUCIÓN
# Cambiamos "sh" por "bash" para que sea compatible con tu script
CMD [ "bash", "/usr/local/bin/start-app.sh" ]