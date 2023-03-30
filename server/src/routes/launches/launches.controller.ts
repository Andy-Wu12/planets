import { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } from "../../models/launches.model";

import { getPagination } from "../../services/query";

import type { Request, Response } from "express";

async function httpGetAllLaunches(req: Request, res: Response) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);

  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req: Request, res: Response) {
  const launch = req.body;
  
  if(!(launch.mission && launch.rocket && launch.launchDate && launch.target)) {
    return res.status(400).json({
      error: 'Missing required launch property',
    })
  }

  launch.launchDate = new Date(launch.launchDate);
  if(isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req: Request, res: Response) {
  const launchId = Number(req.params.id);

  if(!existsLaunchWithId(launchId)) {
    // If launch doesn't exist
    return res.status(404).json({
      error: 'Launch not found'
    })
  }

  // Launch exists
  const aborted = await abortLaunchById(launchId);

  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    });
  }

  return res.status(200).json({
    ok: true
  });
}

export {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}