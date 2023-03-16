import http from 'http';

const PORT = 3000;

const server = http.createServer()

const friends = [
  {
    id: 0,
    name: 'andy wu'
  },
  {
    id: 1,
    name: 'uw ydna'
  }
]
server.on('request', (req, res) => {
  const items = req.url.split('/');
  // /friends/2 => ['', 'friends', '2']
  if(req.method === 'POST' && items[1] == 'friends') {
    req.on('data', (data) => {
      const friend = data.toString();
      console.log('Request:', friend);
      friends.push(JSON.parse(friend));
      /*
       Since req is readable stream and res is writable stream,
       we can just pipe req data back to client through res
      */
    })
    req.pipe(res);
    
  }
  if(req.url === '/friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
 
    res.end(JSON.stringify({
      id: 1,
      name: 'Andy Wu'
    }));
  } else if(req.url === '/messages') {
    res.setHeader('Content-Type', 'application/html')
    
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on localhost://${PORT}`);
});