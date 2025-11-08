import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL if provided (format: mysql://user:pass@host:port/dbname)
function parseConnectionString(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1) // Remove leading slash
    };
  } catch (error) {
    return null;
  }
}

// Use DATABASE_URL if available, otherwise use individual variables
let dbConfig;
if (process.env.DATABASE_URL) {
  const parsed = parseConnectionString(process.env.DATABASE_URL);
  if (parsed) {
    dbConfig = parsed;
    console.log('📦 Using DATABASE_URL for connection');
  } else {
    console.warn('⚠️ Failed to parse DATABASE_URL, falling back to individual variables');
    dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'vista'
    };
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'vista'
  };
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

export default pool;
