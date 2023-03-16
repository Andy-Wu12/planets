import express from 'express';

const app = express();
const PORT = 3000;

const friends = [
  {
    id: 0,
    name: 'andy wu'
  },
  {
    id: 1,
    name: 'happy'
  }
];

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

app.post('/friends', (req, res) => {
  if(!req.body.name) {
    return res.status(400).json({
      error: 'Missing friend name'
    });
  }
   
  const newFriend = {
    id: friends.length,
    name: req.body.name
  };
  friends.push(newFriend);

  res.json(newFriend);
});

app.get('/friends', (req, res) => {
  res.json(friends);
});

// Matches GET /friends/2000
app.get('/friends/:friendId', (req, res) => {
  const friendId = Number(req.params.friendId);
  const friend = friends[friendId];

  if(friend) {
    // Status unnecessary since 200 is default
    res.status(200).json(friend);

  } else {
    // handle 404
    res.status(404).json({
      error: "Friend does not exist"
    });
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})