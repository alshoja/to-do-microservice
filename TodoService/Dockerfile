FROM node

WORKDIR /app/TodoService

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]