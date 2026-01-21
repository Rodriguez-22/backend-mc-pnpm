#!/bin/bash
# Detener el script si ocurre cualquier error
set -e

# --- FUNCIONES (Opcionales, por si las usas más adelante) ---
config_git() {
    git clone --filter=blob:none --no-checkout ${REPO_GIT} backend-mc-pnpm
    cd backend-mc-pnpm
    git sparse-checkout init --cone
    git sparse-checkout set apps/${MICROSERVICIO} libs
    git checkout master
    git pull origin master
}

config_check_git() {
    chmod 600 /root/.ssh/id_rsa
    chmod 644 /root/.ssh/id_rsa.pub
    ssh-keyscan rsa github.com >> /root/.ssh/known_hosts
}

echo " [START.SH] Iniciando proceso de arranque..."

# 1. IR A LA RAÍZ DEL MONOREPO
# Docker monta tu proyecto en /app. Aquí es donde está pnpm-workspace.yaml
cd /app

# 2. INSTALACIÓN
echo " [PNPM] Instalando dependencias desde la raíz..."
pnpm install

# 3. CONSTRUCCIÓN (BUILD)
# Entramos a la carpeta de la aplicación específica
cd apps/${MICROSERVICIO}
echo " [NEST] Ejecutando build de ${MICROSERVICIO}..."
pnpm run build

# 4. COMPROBACIÓN INTELIGENTE (DIAGNÓSTICO)
echo " [DIAGNÓSTICO] Localizando carpeta de salida..."

# Verificamos si el dist se generó dentro de la app o en la raíz del monorepo
if [ -d "dist" ]; then
    export RUTA_DIST="dist"
elif [ -d "../../dist/apps/${MICROSERVICIO}" ]; then
    export RUTA_DIST="../../dist/apps/${MICROSERVICIO}"
else
    echo " ERROR: La carpeta 'dist' no se encuentra en ./dist ni en la raíz."
    ls -F
    exit 1
fi

echo " [OK] Carpeta encontrada en: $RUTA_DIST"
echo "------------------------------------------------"

# 5. BÚSQUEDA DEL ARCHIVO DE INICIO
echo " Buscando 'main.js'..."
ARCHIVO_MAIN=$(find "$RUTA_DIST" -name "main.js" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRÍTICO: No se encontró 'main.js' en $RUTA_DIST"
    exit 1
else
    echo " Archivo encontrado en: $ARCHIVO_MAIN"
    echo " Lanzando PM2..."
    
    # 6. EJECUCIÓN
    pm2-runtime start "$ARCHIVO_MAIN" --name "${MICROSERVICIO}"
fi