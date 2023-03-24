// https://nodejs.org/api/cluster.html

import express from 'express';
import cluster from 'cluster';
import os from 'os';

const app = express();

/* 
  Imagine if you had the code below.
  It causes performance issues if you trigger the delay, then trigger another request.
  We can resolve these issues if we use CLUSTERS...
*/
function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  res.send(`Performance example : ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! : ${process.pid}`);
})

/*
  Running node server.js starts the master (or 'primary') process.
  Each call to fork() creates a new worker process.
  
  Worker processes share requests with a 'round-robin' approach.
  Requests are distributed by getting the first available one.
  If the final worker is busy, 
    the next request starts back at the first worker.

  i.e. - If two different timer requests are triggered on both workers below,
      another request to root will have to wait for first fork to unblock
*/

console.log("Running server.js");
if(cluster.isPrimary) {
  console.log('Master has been started...');

  // Get # of logical cores on system and creater corresponding amount of workers
  const NUM_WORKERS = os.cpus().length;

  for(let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }

} else {
  console.log('Worker process started...');
  app.listen(3000);
}
