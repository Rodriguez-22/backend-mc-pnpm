FROM node:20-alpine

ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

RUN apk update && apk add --no-cache git

WORKDIR /app
COPY ${APP_MS}/deploy/start.sh .
RUN chmod +x ./start.sh
RUN mkdir -p /root/logs

EXPOSE 3000

CMD [ "sh", "/app/start.sh" ]