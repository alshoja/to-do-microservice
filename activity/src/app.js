const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const activityRoutes = require("./routes/Activity");
const dotenv = require('dotenv');
const { CreateChannel } = require('./util')
dotenv.config();
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
      app.listen(process.env.PORT, () => console.log('Activity Service listening to http://localhost:' + process.env.PORT))
    }).catch(err => {
      console.log(err)
    });
  const channel = await CreateChannel();

  app.use(cors());
  app.use(bodyParser.json());
  activityRoutes(app, channel)
}
StartServer();
