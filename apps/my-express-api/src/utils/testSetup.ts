import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

import { beforeAll, afterAll, afterEach } from '@jest/globals';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});
// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Clean up collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});