#!/bin/bash
# Detener el script si ocurre cualquier error
set -e

echo " [START.SH] Iniciando proceso de arranque..."

# 1. INSTALACIÓN
# Usamos --filter para asegurar que instalamos lo de este micro y sus librerías
echo " [PNPM] Instalando dependencias..."
pnpm install

# 2. CONSTRUCCIÓN (BUILD)
echo " [NEST] Ejecutando build..."
# Forzamos el nombre del proyecto para que Nest sepa qué compilar
pnpm run build

# 3. COMPROBACIÓN INTELIGENTE (DIAGNÓSTICO)
echo " [DIAGNÓSTICO] Localizando carpeta de salida..."

# En monorepos, la carpeta suele estar en la raíz o en la carpeta de la app
# Probamos las dos rutas más comunes
if [ -d "dist" ]; then
    export RUTA_DIST="dist"
elif [ -d "../../dist/apps/ms-client-gateway" ]; then
    export RUTA_DIST="../../dist/apps/ms-client-gateway"
else
    echo " ERROR: La carpeta 'dist' no se encuentra en ./dist ni en la raíz."
    # Listamos para debug
    echo " Contenido actual:"
    ls -F
    exit 1
fi

echo " [OK] Carpeta encontrada en: $RUTA_DIST"
echo "------------------------------------------------"

# 4. BÚSQUEDA DEL ARCHIVO DE INICIO
echo " Buscando 'main.js'..."
ARCHIVO_MAIN=$(find "$RUTA_DIST" -name "main.js" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRÍTICO: No se encontró 'main.js' en $RUTA_DIST"
    exit 1
else
    echo " Archivo encontrado en: $ARCHIVO_MAIN"
    echo " Lanzando PM2..."
    
    # 5. EJECUCIÓN
    # --no-daemon es vital para que el contenedor de Docker no se cierre
    pm2-runtime start "$ARCHIVO_MAIN" --name "gateway"
fi