#!/bin/bash
set -e

pnpm start:gateway:dev

pm2 start dist/apps/ms-client-gateway/main.js --name "gateway" --no-daemon

pm2 logs gateway

