FROM node

WORKDIR /app/activity

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "start"]