import { getAllLaunches, addNewLaunch } from "../../models/launches.model.js";

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  
  launch.launchDate = new Date(launch.launchDate);

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

export {
  httpGetAllLaunches,
  httpAddNewLaunch
}