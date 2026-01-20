FROM node:20-alpine

# Argumentos que vienen desde el docker-compose.yml
ARG MICROSERVICIO
# Definimos la ruta de la aplicación basándonos en el argumento
ARG APP_PATH=apps/${MICROSERVICIO}

# 1. Instalamos dependencias y herramientas
RUN apk update && apk add --no-cache git \
    && npm install -g pnpm pm2

# 2. Directorio de trabajo
WORKDIR /app

# 3. COPIA CORREGIDA: 
# Como el contexto es la raíz del proyecto, debemos usar la ruta completa al archivo
COPY ${APP_PATH}/deploy/start.sh /app/start.sh

# 4. Permisos y limpieza de formato Windows (CRLF)
RUN chmod +x /app/start.sh
# 5. Logs y exposición
RUN mkdir -p /root/logs
EXPOSE 3000

# 6. EJECUCIÓN
# Usamos la ruta absoluta donde copiamos el archivo
CMD [ "sh", "/app/start.sh" ]