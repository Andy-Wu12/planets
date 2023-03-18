import express from 'express';

import friendsController from './controllers/friends.js';
import messagesController from './controllers/messages.js';

const app = express();
const PORT = 3000;

// Defining our custom middleware to log request info
app.use((req, res, next) => {
  const start = Date.now();
  // Ensure express passes request to correct handler. Server will hang otherwise
  next();
  // After next function completes
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.url} ${delta}ms`);

})

app.use(express.json());

app.post('/friends', friendsController.postFriend);
app.get('/friends', friendsController.getFriends);
app.get('/friends/:friendId', friendsController.getFriend)

app.get('/messages', messagesController.getMessages);
app.post('/messages', messagesController.postMessage);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})