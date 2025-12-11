# Build Stage
FROM node:20-alpine

# Instalar git en Alpine --> usa sh
ARG CONTEXT
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

# ENV PROYECTO="./proyectos/backend-mc-pnpm"
# ENV MS_GW="./proyectos/backend-mc-pnpm/apps/ms-usuarios"
WORKDIR /app
COPY ${MS_GW}/deploy/start.sh .
COPY ${PROYECTO}/package.json .
COPY ${PROYECTO}/pnpm-lock.yaml .
COPY ${PROYECTO}/.npmrc .
COPY ${PROYECTO}/tsconfig.json .
COPY ${MS_GW}/nest-cli.json .

COPY /libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

#RUN chmod +x ./start.sh
EXPOSE 3000

#ENTRYPOINT [ "./start.sh" ]
CMD ["tail", "-f", "/dev/null"]