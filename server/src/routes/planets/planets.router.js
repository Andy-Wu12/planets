import express from 'express';

import { httpGetAllPlanets } from './planets.controller.js';

const planetsRouter = express.Router();

planetsRouter.get('/planets', httpGetAllPlanets);

export default planetsRouter;