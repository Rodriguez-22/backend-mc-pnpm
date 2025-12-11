#!/bin/bash
set -e
pm2 start dist/apps/ms-client-gateway/main.js --name "gateway" --no-daemon

pnpm start:gateway:dev

pm2 logs gateway

