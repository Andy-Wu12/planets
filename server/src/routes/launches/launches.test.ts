import request from 'supertest';
import app from '../../app';

import { mongoConnect, mongoDisconnect } from '../../services/mongo';

describe('Launches API', () => {
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
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
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
        .post('/launches')
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
      .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toStrictEqual({
        error: "Missing required launch property"
      })
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
      .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date"
      })
    });
  })
});