require('dotenv').config();
const {Pool} = require('pg');

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({connectionString: connectionString});

  return pool;
}

module.exports = {getPool};