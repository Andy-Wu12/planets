import dotenv from 'dotenv';
import http from 'http';

import mongoose from 'mongoose';

import app from './app.js';
import { loadPlanetsData } from './models/planets.model.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'nasa-api'
  });

  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  });
}

startServer();