import fetch from 'isomorphic-fetch';

import Launches from "./launches.mongo";
import planets from "./planets.mongo";

import type { ILaunch } from "./launches.mongo";

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch: ILaunch = { 
  flightNumber: 100, // flight_number
  mission: 'Kepler Exploration X', // name
  rocket: 'Explorer IS1', // rocket.name
  launchDate: new Date('December 27, 2030'), // date_local
  target: 'Kepler-442 b', // Not applicable to SpaceX API
  customers: [
    'NASA',
    'ZTM'
  ], // payload.customers for each payload
  upcoming: true, // upcoming
  success: true // success
}

async function populateLaunches(): Promise<void> {
  // https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md
  const queryData = {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  };

  const response = await fetch(SPACEX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queryData)
  });

  if(response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = (await response.json());

  for(const launchDoc of launchDocs.docs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload: any) => {
      return payload['customers'];
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: customers
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

async function loadLaunchData(): Promise<void> {
  // Check if launch exists (data already populated) and run expensive query if not
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })

  if(firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter: any): Promise<ILaunch | null> {
  return await Launches.findOne(filter);
}

async function existsLaunchWithId(launchId: number): Promise<ILaunch | null> {
  return await findLaunch({
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

async function getAllLaunches(skip: number, limit: number) {
  // .skip(num) skips num DOCUMENTS
  return await Launches
  .find({}, { '_id': 0, '__v': 0})
  .sort({ flightNumber: 1 })
  .skip(skip)
  .limit(limit);
}

async function scheduleNewLaunch(launch: ILaunch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error('No matching planet was found!');
  }

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
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
}