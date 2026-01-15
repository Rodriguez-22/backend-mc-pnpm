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

    # Iniciar la aplicación con PM2
    # IMPORTANTE: Añadimos "ms-productos" al final para decirle a Nest qué proyecto iniciar.
    # Esto ejecutará: pnpm run start:dev ms-productos -> nest start --watch ms-productos
    pm2 start pnpm --name "ms-productos" -- start:productos:dev
}
main
tail -f /dev/null