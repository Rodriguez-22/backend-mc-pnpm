#!/bin/bash
# Detener el script si ocurre cualquier error
set -e

# --- DEFINICIÓN DE FUNCIONES ---

config_git(){
    echo " [GIT] Configurando repositorio y haciendo sparse-checkout..."
    
    # Corregido: ${REPO_GIT} en lugar de &{REPO_GIT}
    git clone --filter=blob:none --no-checkout ${REPO_GIT} backend-mc-pnpm
    cd backend-mc-pnpm

    git sparse-checkout init --cone
    git sparse-checkout set apps/${MICROSERVICIO} libs
    git checkout master

    git pull origin master
    
    # Es importante quedarse en la carpeta donde está el package.json para el build
    echo " [GIT] Repositorio listo."
}

# --- FLUJO DE EJECUCIÓN ---

echo " [START.SH] Iniciando proceso de arranque..."

# 1. EJECUTAR CONFIGURACIÓN DE GIT (Ahora es lo primero)
# config_git

# 2. CONSTRUCCIÓN (BUILD)
# Se asume que ahora estamos dentro de 'backend-mc-pnpm' gracias al 'cd' de la función
echo " Ejecutando build..."
pnpm install  # Es recomendable asegurar que las dependencias están ahí antes del build
pnpm run build

# 3. COMPROBACIÓN (DIAGNÓSTICO)
echo " [DIAGNÓSTICO] Listando contenido de la carpeta 'dist':"
if [ -d "dist" ]; then
    find dist -maxdepth 4
else
    echo " ERROR: La carpeta 'dist' NO SE HA CREADO después del build."
    exit 1
fi
echo "------------------------------------------------"

# 4. BÚSQUEDA DEL ARCHIVO DE INICIO
echo " Buscando 'main.js'..."
ARCHIVO_MAIN=$(find dist -name "main.js" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRÍTICO: No se encontró 'main.js' en ninguna subcarpeta de dist."
    exit 1
else
    echo " Archivo encontrado en: $ARCHIVO_MAIN"
    echo " Lanzando PM2..."
    
    # 5. EJECUCIÓN
    pm2 start "$ARCHIVO_MAIN" --name "gateway" --no-daemon
fi