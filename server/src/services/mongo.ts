import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: 'nasa-api'
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export {
  mongoConnect,
  mongoDisconnect
}