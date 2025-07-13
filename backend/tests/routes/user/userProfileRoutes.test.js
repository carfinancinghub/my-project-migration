// userProfileRoutes.test.js
const request = require('supertest');
jest.mock('@root/app');
import app from '@root/app';
describe('User Profile Routes', () => {
  test('GET /user/profile should return 200', async () => {
    const response = await request(app).get('/user/profile');
    expect(response.status).toBe(200);
  });
});










