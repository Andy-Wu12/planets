import launches from "./launches.mongo.js";
import planets from "./planets.mongo.js";

let latestFlightNumber = 100;

const launch = {
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

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
}

async function getAllLaunches() {
  return await launches.find({}, {
    '_id': 0, '__v': 0
  });
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  )
}

// Instead of deleting data, keep it but just mark as aborted and failed
function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if(!planet) {
    throw new Error('No matching planet was found!');
  }

  await launches.updateOne({
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