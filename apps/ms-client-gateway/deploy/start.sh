#!/bin/bash
set -e

# --- FUNCIONES ---
config_check_git() {
    echo " [SSH] Preparando llaves..."
    mkdir -p /root/.ssh
    chmod 700 /root/.ssh

    # Copiamos desde donde montamos el Secret en el deployment.yaml
    if [ -f /mnt/ssh-keys/id_rsa ]; then
        cp /mnt/ssh-keys/id_rsa /root/.ssh/id_rsa
        chmod 600 /root/.ssh/id_rsa
        echo " [OK] Llave privada configurada."
    else
        echo " [ERROR] No se encontro id_rsa en /mnt/ssh-keys"
        exit 1
    fi

    # La llave publica es opcional, si no esta, no rompemos el script
    if [ -f /mnt/ssh-keys/id_rsa.pub ]; then
        cp /mnt/ssh-keys/id_rsa.pub /root/.ssh/id_rsa.pub
        chmod 644 /root/.ssh/id_rsa.pub
    fi

    # Evitamos que pregunte "Are you sure you want to continue connecting?"
    ssh-keyscan github.com >> /root/.ssh/known_hosts 2>/dev/null
}

config_git() {
    echo " [GIT] Clonando en /app/proyecto..."
    # Limpiamos carpeta por si acaso
    rm -rf /app/proyecto
    git clone --filter=blob:none --no-checkout ${REPO_GIT} /app/proyecto
    cd /app/proyecto

    git sparse-checkout init --cone
    git sparse-checkout set apps/${MICROSERVICIO} libs
    
    git checkout master
    git pull origin master
}

# --- EJECUCION ---
echo " [START.SH] Iniciando proceso de arranque..."

config_check_git
config_git

cd /app/proyecto

echo " [PNPM] Instalando dependencias del monorepo..."
pnpm install --frozen-lockfile || pnpm install

echo " [NEST] Ejecutando build de ${MICROSERVICIO}..."
pnpm nest build ${MICROSERVICIO}

echo " [PM2] Buscando archivo de inicio..."
ARCHIVO_MAIN=$(find /app/proyecto/dist -name "main.js" | grep "${MICROSERVICIO}" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo " ERROR CRITICO: No se encontro main.js para ${MICROSERVICIO}"
    exit 1
else
    echo " [OK] Archivo encontrado en: $ARCHIVO_MAIN"
    pm2-runtime start "$ARCHIVO_MAIN" --name "${MICROSERVICIO}"
fi