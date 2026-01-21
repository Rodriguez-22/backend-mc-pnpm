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

# 3. Instalación
cd /app/proyecto
echo " [PNPM] Instalando dependencias..."
pnpm install

# 4. Construcción (Desde la raíz para evitar errores de ruta en monorepo)
echo " [NEST] Ejecutando build de ${MICROSERVICIO}..."
# Ejecutamos el build desde la raíz especificando el proyecto
pnpm nest build ${MICROSERVICIO}

# 5. Localización y Ejecución
echo " [PM2] Buscando archivo de inicio..."

# Buscamos de forma absoluta desde la raíz del proyecto
ARCHIVO_MAIN=$(find /app/proyecto/dist -name "main.js" | grep "${MICROSERVICIO}" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRÍTICO: No se encontró main.js para ${MICROSERVICIO}"
    echo " Contenido de la carpeta dist:"
    ls -R /app/proyecto/dist || echo "Carpeta dist no existe"
    exit 1
else
    echo " [OK] Archivo encontrado en: $ARCHIVO_MAIN"
    pm2-runtime start "$ARCHIVO_MAIN" --name "${MICROSERVICIO}"
fi