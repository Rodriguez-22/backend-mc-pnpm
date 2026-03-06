FROM node:20-alpine

# Argumentos
ARG MICROSERVICIO
# 👇 FIX 1: Exportamos el ARG a ENV para que el script start.sh pueda leerlo
ENV MICROSERVICIO=${MICROSERVICIO}
ENV APP_DIR=apps/${MICROSERVICIO}

# 1. Instalamos herramientas
RUN apk update && apk add --no-cache git openssh-client bash \
    && npm install -g pnpm pm2

# 2. Directorio de trabajo
WORKDIR /app

# 👇 FIX 2: Copiamos el código compilado y los módulos (¡Esto faltaba!)
COPY package.json pnpm-lock.yaml ./
COPY node_modules ./node_modules
COPY dist ./dist

# 3. Copiamos el script
COPY apps/${MICROSERVICIO}/deploy/start.sh /usr/local/bin/start-app.sh

# 4. Permisos
RUN chmod +x /usr/local/bin/start-app.sh && \
    sed -i 's/\r$//' /usr/local/bin/start-app.sh

EXPOSE 3000

# 5. EJECUCIÓN
CMD [ "bash", "/usr/local/bin/start-app.sh" ]