FROM node:20

WORKDIR /usr/src/todo-app

COPY --chown=node:node . .

RUN npm ci

ENV DEBUG=todo-backend:*

USER node

CMD npm start
