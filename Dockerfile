FROM node:20.19.0-alpine AS dev

WORKDIR /usr/src/app

COPY package*.json ./

ARG FONTAWESOME_TOKEN=REEMPLAZAR
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/ \
    && npm config set "//npm.fontawesome.com/:_authToken" "$FONTAWESOME_TOKEN" \
    && npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
