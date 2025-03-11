import axios from 'axios';

describe('GET /', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Welcome!' });
  });
});

describe('GET /health', () => {
  it('should return connected message', async () => {
    const res = await axios.get(`/health`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      status: 'healthy',
      details: {
        database: 'connected',
      },
    });
  });
});
