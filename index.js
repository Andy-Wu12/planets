import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

const habitablePlanets = [];

function isHabitable(planet) {
  const stellarFlux = planet['koi_insol'];
  const radius = planet['koi_prad'];
  // Following guidelines at 
  // https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/
  return (
    planet['koi_disposition'] === 'CONFIRMED' && 
    stellarFlux > 0.36 && 
    stellarFlux < 1.11 &&
    radius < 1.6
  );
}

createReadStream('kepler_data.csv')
  // Pipe connects a READABLE stream source to a WRITABLE stream destination
  .pipe(parse({
    comment: '#',
    columns: true
  }))
  .on('data', (data) => {
    if(isHabitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }));
    console.log(`${habitablePlanets.length} habitable planets`);
  });


