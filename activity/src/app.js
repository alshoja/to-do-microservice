import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/index.js';

import bodyParser from 'body-parser';
import env from 'dotenv';
import { CreateChannel, headers, error } from './util/index.js';

const Server = async () => {
  const app = express();
  env.config();
  try {
    app.use(headers);
    app.use(error);
    app.use(cors());
    app.use(bodyParser.json());
    const channel = await CreateChannel();
    routes(app, channel);
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    app.listen(process.env.PORT, () => {
      console.log('Activity Service listening to http://localhost:' + process.env.PORT)
      console.log('Database connected')
    })
  } catch (error) {
    console.log(error)
  }

}
Server();