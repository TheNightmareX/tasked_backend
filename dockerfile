FROM node:15-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
RUN npm run build \
    && DB_PATH=data/db.sqlite3 npm run start-db:prod init

FROM build AS build-pruned
RUN npm i --production

FROM node:15-alpine AS production
EXPOSE 3000
VOLUME /app/data
WORKDIR /app
COPY package*.json ./
COPY --from=build-pruned /app/node_modules/ node_modules/
COPY --from=build-pruned /app/dist/ dist/
COPY --from=build-pruned /app/data/ data/
CMD npm run start:prod
