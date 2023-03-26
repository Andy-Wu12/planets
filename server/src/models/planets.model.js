import { parse } from 'csv-parse';
import fs from 'fs';

import planets from './planets.mongo.js';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if(isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  // Optional second parameter 'projection' to include / exclude fields from result
  // Ex: { keplerName: 0 } to hide or 1 to show
  // Ex 2: 'keplerName anotherField'. To exclude field, use - i.e. '-keplerName'

  // https://mongoosejs.com/docs/api/model.html

  return await planets.find({}, {
    '_id': 0,
    '__v': 0
  });
};

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    });
  } catch(err) {
    console.error(`Could not save planet ${err}`);
  }
}

export {
  getAllPlanets,
  loadPlanetsData
}