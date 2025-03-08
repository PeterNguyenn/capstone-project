import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'nx_dev',
  password: 'postgres',
  port: 5432,
});