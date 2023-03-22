import { getAllPlanets } from '../../models/planets.model.js';

function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

export {
  httpGetAllPlanets
};