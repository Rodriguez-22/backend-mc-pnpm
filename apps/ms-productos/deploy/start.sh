#!/bin/bash
set -e

main(){
    # Instalación de herramientas
    npm install -g npm@11.7.0
    npm install -g pnpm
    npm install -g pm2

    # Instalar dependencias
    pnpm install --frozen-lockfile

    echo "Iniciando Microservicio Productos..."

    # Borrar proceso antiguo si existe y arrancar
    pm2 delete ms-productos 2>/dev/null || true
    
    # IMPORTANTE: Solo arrancar, SIN líneas de Prisma
    pm2 start pnpm --name "ms-productos" -- run start:dev ms-productos
}
main
tail -f /dev/null