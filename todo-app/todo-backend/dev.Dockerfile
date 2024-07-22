FROM node:20

WORKDIR /usr/src/todo-app

COPY --chown=node:node . .

RUN npm install

ENV DEBUG=todo-backend:*

USER node

CMD ["npm", "run", "dev", "--", "--host"]