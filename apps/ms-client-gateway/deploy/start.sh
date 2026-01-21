#!/bin/bash
set -e

# --- FUNCIONES ---
config_check_git() {
    echo " [SSH] Preparando llaves..."
    mkdir -p /root/.ssh
    chmod 700 /root/.ssh
    # Copiamos las llaves mapeadas desde el host si existen
    cp /root/.ssh_host/* /root/.ssh/ 2>/dev/null || true
    
    chmod 600 /root/.ssh/id_rsa
    chmod 644 /root/.ssh/id_rsa.pub
    ssh-keyscan github.com >> /root/.ssh/known_hosts
}

config_git() {
    echo " [GIT] Clonando en /app/proyecto..."
    # Clonamos directamente en una carpeta específica
    git clone --filter=blob:none --no-checkout ${REPO_GIT} /app/proyecto
    cd /app/proyecto

    git sparse-checkout init --cone
    git sparse-checkout set apps/${MICROSERVICIO} libs
    
    git checkout master
    git pull origin master
}

# --- EJECUCIÓN ---
echo " [START.SH] Iniciando proceso de arranque..."

# 1. SSH y GIT primero
config_check_git
config_git

# 2. Ahora que el código está en /app/proyecto, entramos para instalar
cd /app/proyecto

echo " [PNPM] Instalando dependencias desde la raíz del proyecto..."
# Ahora pnpm encontrará el package.json y pnpm-workspace.yaml
pnpm install

# 3. Construcción
cd apps/${MICROSERVICIO}
echo " [NEST] Ejecutando build..."
pnpm run build

# 4. Lanzamiento
if [ -d "dist" ]; then
    export RUTA="dist"
else
    export RUTA="../../dist/apps/${MICROSERVICIO}"
fi

pm2-runtime start ${RUTA}/main.js --name "${MICROSERVICIO}"