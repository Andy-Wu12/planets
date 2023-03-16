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

app.get('/message', (req, res) => {
  res.send('<ul><li>HELLOOO</li></u l>');
});

app.post('/messages', (req, res) => {
  console.log('updating messages...');
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})