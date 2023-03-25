// import launches from "./launches.mongo.js";

const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
}

function getAllLaunches() {
  return Array.from(launches.values());
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

export {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
}