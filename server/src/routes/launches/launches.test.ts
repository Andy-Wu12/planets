import request from 'supertest';
import app from '../../app';

import { mongoConnect, mongoDisconnect } from '../../services/mongo';

function getRandomInt(limit: number, offset: number = 0) {
  return Math.round((Math.random() * limit) + offset);
}

describe('Launches API', () => {
  const MIN_PAGE_LIMIT = 0, MIN_PAGE_NUMBER = 1;

  const validLimitNotZero = getRandomInt(20, MIN_PAGE_LIMIT + 1);
  const invalidLimit = getRandomInt(-20, MIN_PAGE_LIMIT - 1);

  const validPage = getRandomInt(5, MIN_PAGE_NUMBER);
  const invalidPage = getRandomInt(-5);

  // Note that these E2E tests actually affect the real database. 
  // It would be a good idea to create a database specifically for testing to prevent issues in production.
  beforeAll(async () => {
    await mongoConnect();
  })

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      // These are supertest assertions, NOT JEST
      await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    })

    test('It should hide document _id and __v', async () => {
      const response = await request(app)
        .get('/v1/launches')

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);

      for(const doc of response.body) {
        expect(doc).not.toHaveProperty('_id');
        expect(doc).not.toHaveProperty('__v');
      }
    })

    describe('Test document limit query', () => {
      test('It should limit document count if query parameter is set', async () => {
        const response = await request(app)
          .get(`/v1/launches?limit=${validLimitNotZero}`)

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeLessThanOrEqual(validLimitNotZero);
      })

      test('It should prevent negative limits by defaulting to 0', async () => {
        const response = await request(app)
          .get(`/v1/launches?limit=${invalidLimit}`)
        
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
      })

      test('It should show all documents if limit is zero', async () => {
        const response = await request(app)
          .get(`/v1/launches?limit=${MIN_PAGE_LIMIT}`)

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
      })

    });

    describe('Test pagination', () => {
      test('It should default to 1 if page value is less than or equal to zero', async () => {
        const response_negative_page = await request(app)
          .get(`/v1/launches?limit=${MIN_PAGE_LIMIT}&page=${invalidPage}`)
        
        const response_page_1 = await request(app)
          .get(`/v1/launches?limit=${MIN_PAGE_LIMIT}&page=${MIN_PAGE_NUMBER}`)
        
        expect(response_negative_page.body).toStrictEqual(response_page_1.body);
      })
      
    });

  });

  describe('Test POST /launch', () => {
    const launchData = {
      mission: "fake mission",
      rocket: "fake rocket",
      target: "Kepler-62 f",
      launchDate: 'January 1, 2020'
    };

    const launchDataWithoutDate = {
      mission: "fake mission",
      rocket: "fake rocket",
      target: "Kepler-62 f"
    }

    const launchDataWithInvalidDate = {
      mission: "fake mission",
      rocket: "fake rocket",
      target: "Kepler-62 f",
      launchDate: 'bad date'
    }

    test('It should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(201);

      // JEST assertions
      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    })

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toStrictEqual({
        error: "Missing required launch property"
      })
    })

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date"
      })
    })

    test('It should return a valid new launch in JSON', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchData)
        .expect('Content-Type', /json/)
        .expect(201);

      for(const prop in launchData) {
        expect(response.body).toHaveProperty(prop);
      }
    })

  })
});