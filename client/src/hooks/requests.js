const API_BASE_URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(`${API_BASE_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_BASE_URL}/launches`);
  const launchesData = await response.json();
  return launchesData.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_BASE_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    })
  } catch(err) {
    return {
      ok: false
    };
  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    const response = await fetch(`${API_BASE_URL}/launches/${id}`, {
      method: 'delete'
    });
    return response;
  } catch(err) {
    console.log(err);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};