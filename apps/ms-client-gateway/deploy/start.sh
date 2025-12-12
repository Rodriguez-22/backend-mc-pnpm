#!/bin/bash
set -e

echo "🚀 [START.SH] Iniciando proceso de arranque..."

# 1. Ejecutar el build explícitamente
echo "🔨 Ejecutando build..."
pnpm run build:gateway

# 2. DIAGNÓSTICO: Listar qué se ha creado realmente
echo "🔍 [DIAGNÓSTICO] Listando contenido de la carpeta 'dist':"
if [ -d "dist" ]; then
    # Busca archivos hasta 4 niveles de profundidad para ver la estructura
    find dist -maxdepth 4
else
    echo "❌ ERROR: La carpeta 'dist' NO SE HA CREADO después del build."
    exit 1
fi
echo "------------------------------------------------"

# 3. Intentar localizar main.js automáticamente
echo "🕵️ Buscando 'main.js'..."
ARCHIVO_MAIN=$(find dist -name "main.js" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo "❌ ERROR CRÍTICO: No se encontró 'main.js' en ninguna subcarpeta de dist."
    exit 1
else
    echo "✅ Archivo encontrado en: $ARCHIVO_MAIN"
    echo "🚀 Lanzando PM2..."
    # Ejecutamos PM2 usando la ruta que hemos encontrado dinámicamente
    pm2 start "$ARCHIVO_MAIN" --name "gateway" --no-daemon
fi