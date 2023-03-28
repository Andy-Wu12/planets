import Launches from "./launches.mongo";
import planets from "./planets.mongo";

import type { ILaunch } from "./launches.mongo";

let latestFlightNumber = 100;

const launch: ILaunch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: [
    'NASA',
    'ZTM'
  ],
  upcoming: true,
  success: true
}

saveLaunch(launch);

async function existsLaunchWithId(launchId: number): Promise<boolean> {
  const launch = await Launches.exists({
    flightNumber: launchId
  });

  return launch !== null;
}

async function getAllLaunches() {
  return await Launches.find({}, {
    '_id': 0, '__v': 0
  });
}

async function addNewLaunch(launch: ILaunch): Promise<void> {
  latestFlightNumber++;
  await saveLaunch(
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  )
}

// Instead of deleting data, keep it but just mark as aborted and failed
async function abortLaunchById(launchId: number): Promise<ILaunch | null> {
  const aborted = await Launches.findOne({
    flightNumber: launchId
  });

  if(aborted) {
    aborted.upcoming = false;
    aborted.success = false;
    await saveLaunch(aborted);
  }

  return aborted;
}

async function saveLaunch(launch: ILaunch): Promise<void> {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error('No matching planet was found!');
  }

  await Launches.updateOne({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

export {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
}