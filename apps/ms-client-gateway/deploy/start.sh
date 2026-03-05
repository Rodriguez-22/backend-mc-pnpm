#!/bin/bash
set -e

echo " [START.SH] Iniciando Microservicio: ${MICROSERVICIO}..."

# 1. El código ya está en /app porque Jenkins lo copió en el build
cd /app

# 2. Buscamos el archivo ya compilado (NestJS deja los builds en /dist)
# Jenkins ya ejecutó el build, así que el archivo DEBE estar ahí.
ARCHIVO_MAIN=$(find ./dist -name "main.js" | grep "${MICROSERVICIO}" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRÍTICO: No se encontró el build en ./dist para ${MICROSERVICIO}"
    echo " Listando contenido de dist para depurar:"
    ls -R ./dist
    exit 1
else
    echo " [OK] Build encontrado en: $ARCHIVO_MAIN"
    echo " [PM2] Lanzando aplicación..."
    exec pm2-runtime start "$ARCHIVO_MAIN" --name "${MICROSERVICIO}"
fi