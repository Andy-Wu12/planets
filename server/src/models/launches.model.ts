import Launches from "./launches.mongo";
import planets from "./planets.mongo";

import type { ILaunch } from "./launches.mongo";

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existsLaunchWithId(launchId: number): Promise<ILaunch | null> {
  return await Launches.findOne({
    flightNumber: launchId
  });

}

async function getLatestFlightNumber(): Promise<number> {
  const latestLaunch = await Launches.findOne().sort('-flightNumber');

  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await Launches.find({}, {
    '_id': 0, '__v': 0
  });
}

async function scheduleNewLaunch(launch: ILaunch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch: ILaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
  })

  await saveLaunch(newLaunch);
}

// Instead of deleting data, keep it but just mark as aborted and failed
async function abortLaunchById(launchId: number): Promise<boolean> {
  const abortedResult = await Launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return abortedResult.acknowledged && abortedResult.modifiedCount == 1
}

async function saveLaunch(launch: ILaunch): Promise<void> {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error('No matching planet was found!');
  }

  // Unlike updateOne, 
  // findOneAndUpdate only returns the properties that we explicitly set  
  // That means hidden data like __v is NOT returned
  await Launches.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

export {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
}