import express from 'express';

import { getAllPlanets } from './planets.controller.js';

const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);

export default planetsRouter;