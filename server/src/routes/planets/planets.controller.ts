import { getAllPlanets } from '../../models/planets.model.js';

import type { Request, Response } from 'express';

async function httpGetAllPlanets(req: Request, res: Response) {
  return res.status(200).json(await getAllPlanets());
}

export {
  httpGetAllPlanets
};