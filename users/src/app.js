const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express()

const userRoutes = require('./routes/user')
app.use('/', userRoutes);
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => console.log('User Service listening to http://localhost:' + process.env.PORT))
  }).catch(err => {
    console.log(err)
  });
