import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import friendsRouter from './routes/friends.js';
import messagesRouter from './routes/messages.js';

// Required if attempting to use __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Defining our custom middleware to log request info
app.use((req, res, next) => {
  const start = Date.now();
  // Ensure express passes request to correct handler. Server will hang otherwise
  next();
  // After next function completes
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);

})

app.use('/site', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})