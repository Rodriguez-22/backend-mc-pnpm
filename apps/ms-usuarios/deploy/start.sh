#!/bin/bash
set -e

config.git(){
    git clone https://github.com/Rodriguez-22/backend-mc-pnpm.git
}

#....

main(){
    npm install -g npm@11.7.0
    npm install -g pnpm
    npm install -g pm2

    pnpm install --frozen-lockfile

    echo "Data Base: $DB_NAME"

    cd apps/ms-usuarios
    pnpm exec prisma generate

    pnpm exec prisma migrate deploy
    
    cd ../..
    
    pm2 delete ms-usuarios 2>/dev/null || true
    
    pm2 start pnpm --name "ms-usuarios" -- start:usuarios:dev

}
main
tail -f /dev/null