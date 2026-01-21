#!/bin/bash
# Detener el script si ocurre cualquier error
set -e

# --- DEFINICIÓN DE FUNCIONES ---

config_check_git() {
    echo " [SSH] Configurando permisos de llaves..."
    # Ajustamos permisos para que SSH no las rechace por ser "demasiado abiertas"
    chmod 600 /root/.ssh/id_rsa
    chmod 644 /root/.ssh/id_rsa.pub
    # Agregamos GitHub a los hosts conocidos para evitar el mensaje de confirmación
    ssh-keyscan github.com >> /root/.ssh/known_hosts
}

config_git() {
    echo " [GIT] Clonando repositorio privado..."
    # Clonamos sin descargar archivos todavía (--no-checkout) para luego filtrar
    git clone --filter=blob:none --no-checkout ${REPO_GIT} /app/temp_repo
    cd /app/temp_repo

    # Configuramos el sparse-checkout para traer solo la app y las libs
    git sparse-checkout init --cone
    git sparse-checkout set apps/${MICROSERVICIO} libs
    
    echo " [GIT] Descargando archivos (checkout)..."
    git checkout master
    git pull origin master
}

# --- FLUJO DE EJECUCIÓN ---

echo " [START.SH] Iniciando proceso de despliegue desde Git..."

# 1. Preparar SSH
config_check_git

# 2. Descargar el código
# Limpiamos /app por si hay restos de intentos anteriores
rm -rf /app/temp_repo
config_git

# 3. Instalación de dependencias
# Entramos a la raíz del repo clonado donde está el pnpm-workspace.yaml
cd /app/temp_repo
echo " [PNPM] Instalando dependencias del monorepo..."
pnpm install

# 4. Construcción del Microservicio
cd apps/${MICROSERVICIO}
echo " [NEST] Ejecutando build..."
pnpm run build

# 5. Localizar dist y arrancar
if [ -d "dist" ]; then
    export RUTA_FINAL="dist"
else
    export RUTA_FINAL="../../dist/apps/${MICROSERVICIO}"
fi

echo " [PM2] Lanzando aplicación..."
pm2-runtime start ${RUTA_FINAL}/main.js --name "${MICROSERVICIO}"