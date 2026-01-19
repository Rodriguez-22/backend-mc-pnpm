#!/bin/bash
# Esta línea le dice al ordenador que detenga todo inmediatamente si ocurre algún error.
# Es una medida de seguridad para no seguir si algo falló antes.
set -e

echo " [START.SH] Iniciando proceso de arranque..."

# 1. CONSTRUCCIÓN (BUILD)
# Aquí traducimos tu código (escrito en TypeScript) a algo que el ordenador pueda ejecutar (JavaScript).
# Es como cocinar los ingredientes crudos para tener el plato listo.
echo " Ejecutando build..."
pnpm run build:gateway

# 2. COMPROBACIÓN (DIAGNÓSTICO)
# Verificamos si la "cocina" ha sacado el plato (si se ha creado la carpeta 'dist').
echo " [DIAGNÓSTICO] Listando contenido de la carpeta 'dist':"

# Si la carpeta 'dist' existe...
if [ -d "dist" ]; then
    # ...miramos qué hay dentro (hasta 4 subcarpetas) para asegurarnos de que no esté vacía.
    find dist -maxdepth 4
else
    # Si no existe, gritamos "ERROR" y paramos todo (exit 1).
    echo " ERROR: La carpeta 'dist' NO SE HA CREADO después del build."
    exit 1
fi
echo "------------------------------------------------"

# 3. BÚSQUEDA DEL ARCHIVO DE INICIO
# A veces el archivo principal se esconde en subcarpetas.
# Aquí le decimos al ordenador: "Busca dónde está 'main.js' dentro de la carpeta 'dist'".
echo " Buscando 'main.js'..."
ARCHIVO_MAIN=$(find dist -name "main.js" | head -n 1)

# Si la variable está vacía (no encontró nada)...
if [ -z "$ARCHIVO_MAIN" ]; then
    # ...avisamos del error crítico y paramos.
    echo " ERROR CRÍTICO: No se encontró 'main.js' en ninguna subcarpeta de dist."
    exit 1
else
    # Si lo encontró, le decimos dónde está.
    echo " Archivo encontrado en: $ARCHIVO_MAIN"
    echo " Lanzando PM2..."
    
    # 4. EJECUCIÓN
    # Arrancamos la aplicación usando PM2 (el gestor de procesos) con el archivo que acabamos de encontrar.
    # --no-daemon mantiene el proceso visible para que Docker no crea que se ha apagado.
    pm2 start "$ARCHIVO_MAIN" --name "gateway" --no-daemon
fi


config_git(){
    git clone --filter=blob:none --no-checkout &{REPO_GIT} backend-mc-pnpm
    cd backend-mc-pnpm

    git sparse-checkout init --cone

    git sparse-checkout set apps/${MICROSERVICIO} libs
    git checkout master

    git pull origin master
}