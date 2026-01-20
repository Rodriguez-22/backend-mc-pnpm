FROM node:20-alpine

# Argumentos (se mantienen por si los usas en otras partes)
ARG MICROSERVICIO

# 1. Instalamos dependencias del sistema y herramientas de Node
# Añadimos 'sed' para limpiar archivos de texto si vienen de Windows
RUN apk update && apk add --no-cache git \
    && npm install -g pnpm pm2

# 2. Establecemos el directorio de trabajo
WORKDIR /app

# 3. Copiamos el script de arranque
# Si el Dockerfile y start.sh están en la misma carpeta 'deploy', solo necesitamos:
COPY start.sh .

# 4. CORRECCIONES CRÍTICAS:
# - Damos permisos de ejecución
# - Eliminamos posibles finales de línea de Windows (CRLF) que rompen Alpine
RUN chmod +x ./start.sh && \
    sed -i 's/\r$//' ./start.sh

# 5. Creamos carpeta de logs
RUN mkdir -p /root/logs

# Puerto que expone la app
EXPOSE 3000

# 6. Ejecución
# Usamos la ruta absoluta para evitar errores de contexto
CMD [ "sh", "/app/start.sh" ]