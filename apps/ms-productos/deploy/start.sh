#!/bin/bash
set -e

main(){
    # Instalación de herramientas globales
    npm install -g npm@11.7.0
    npm install -g pnpm
    npm install -g pm2

    # Instalar dependencias del monorepo
    pnpm install --frozen-lockfile

    echo "Iniciando Microservicio Productos..."

    # En este caso no hace falta migración manual porque usas synchronize: true en TypeORM
    
    # Iniciar la aplicación con PM2
    # Usamos start:dev como en tu package.json, o puedes cambiarlo a start:prod si prefieres el build
    pm2 start pnpm --name "ms-productos" -- start:dev
}
main
tail -f /dev/null