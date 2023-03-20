import path from 'path';
import express from 'express';
import cors from 'cors';

import planetsRouter from './routes/planets/planets.router.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(planetsRouter);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;