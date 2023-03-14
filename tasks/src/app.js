const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/Todo");
const dotenv = require('dotenv');
dotenv.config();
const { CreateChannel } = require('./util')
const channel = await CreateChannel();
const app = express();

const StartServer = async () => {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });


  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      app.listen(process.env.PORT, () => console.log('Todo Service listening to http://localhost:' + process.env.PORT))
    }).catch(err => {
      console.log(err)
    });

  app.use(cors());
  app.use(bodyParser.json());

  todoRoutes(app, channel);
}

StartServer();