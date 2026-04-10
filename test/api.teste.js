const request = require('supertest');
const app = require('../src/app');

describe('GET /books', () => {
  it('deve retornar a lista de livros e status 200', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });
});