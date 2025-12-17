#!/bin/bash
# Si algo falla en cualquier línea, el script se detiene inmediatamente (seguridad).
set -e

# (Esta función define cómo descargar el código, aunque no se usa dentro del main en este ejemplo)
config.git(){
    git clone https://github.com/Rodriguez-22/backend-mc-pnpm.git
}

main(){
    # 1. INSTALACIÓN DE HERRAMIENTAS GLOBALES
    # Instalamos las herramientas básicas que necesitamos en el sistema (contenedor).
    npm install -g npm@11.7.0
    npm install -g pnpm  # El gestor de paquetes rápido que usas
    npm install -g pm2   # El gestor de procesos para mantener la app viva

    # 2. INSTALACIÓN DE LIBRERÍAS DEL PROYECTO
    # Descarga todas las dependencias escritas en el 'pnpm-lock.yaml'.
    # --frozen-lockfile: Asegura que se instalan versiones EXACTAS (ideal para que no haya sorpresas).
    pnpm install --frozen-lockfile

    echo "Data Base: $DB_NAME" # Muestra el nombre de la BD en la consola (útil para verificar).

    # 3. PREPARACIÓN DE LA BASE DE DATOS (PRISMA)
    # Entramos en la carpeta específica del microservicio de usuarios.
    cd apps/ms-usuarios
    
    # Crea el "Cliente Prisma": traduce tu esquema de BD a código JavaScript para que tu app lo entienda.
    pnpm exec prisma generate

    # Aplica los cambios pendientes en la estructura de la base de datos (crear tablas, columnas, etc.).
    pnpm exec prisma migrate deploy
    
    # Volvemos a la carpeta raíz del proyecto.
    cd ../..
    
    # 4. REINICIO LIMPIO
    # Si ya había un proceso llamado "ms-usuarios" corriendo, lo borra para empezar de cero.
    # "|| true" significa: "Si falla al borrar (porque no existía), no te preocupes y sigue".
    pm2 delete ms-usuarios 2>/dev/null || true
    
    # 5. ARRANQUE
    # Iniciamos la aplicación usando PM2.
    # Ejecuta el comando 'start:usuarios:dev' definido en tu package.json.
    pm2 start pnpm --name "ms-usuarios" -- start:usuarios:dev

}

# Ejecutamos la función principal definida arriba.
main

# 6. MANTENER VIVO EL CONTENEDOR
# Este es un truco común en Docker.
# Como PM2 corre en segundo plano, Docker pensaría que el script terminó y apagaría el contenedor.
# "tail -f /dev/null" es un comando que se queda esperando eternamente sin hacer nada, manteniendo el contenedor encendido.
tail -f /dev/null