FROM node

WORKDIR /app/activity

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]