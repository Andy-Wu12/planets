import { planets } from '../../models/planets.model.js';

function getAllPlanets(req, res) {
  return res.status(200).json(planets);
}

export {
  getAllPlanets
};