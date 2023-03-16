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
]
app.get('/', (req, res) => {
  res.send({
    id: 1,
    name: 'Andy Wu'
  });
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