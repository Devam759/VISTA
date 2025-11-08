import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function resolveFailedMigration() {
  console.log('Checking for failed migrations...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Parse the MySQL connection string
  let config;
  try {
    const urlString = connectionString.replace(/^mysql2?:\/\//, 'http://');
    const url = new URL(urlString);
    
    config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password || ''),
      database: url.pathname.slice(1),
    };
  } catch (error) {
    console.error('ERROR: Error parsing DATABASE_URL:', error.message);
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database successfully');
    
    // Check if _prisma_migrations table exists
    const [tables] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = '_prisma_migrations'`,
      [config.database]
    );

    if (tables[0].count === 0) {
      console.log('_prisma_migrations table does not exist, nothing to resolve');
      return;
    }

    // Check for failed migrations
    const [failedMigrations] = await connection.execute(
      `SELECT id, migration_name, started_at, finished_at, rolled_back_at 
       FROM _prisma_migrations 
       WHERE finished_at IS NULL AND rolled_back_at IS NULL`
    );

    if (failedMigrations.length === 0) {
      console.log('No failed migrations found');
      return;
    }

    console.log(`Found ${failedMigrations.length} failed migration(s):`);
    for (const migration of failedMigrations) {
      console.log(`  - ${migration.migration_name} (started at ${migration.started_at})`);
    }

    // Mark failed migrations as rolled back
    for (const migration of failedMigrations) {
      console.log(`Marking migration ${migration.migration_name} as rolled back...`);
      await connection.execute(
        `UPDATE _prisma_migrations 
         SET rolled_back_at = NOW() 
         WHERE id = ?`,
        [migration.id]
      );
      console.log(`✓ Migration ${migration.migration_name} marked as rolled back`);
    }

    console.log('✓ All failed migrations resolved');
  } catch (error) {
    console.error('ERROR:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

resolveFailedMigration()
  .then(() => {
    console.log('Migration resolution complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to resolve migrations:', error);
    process.exit(1);
  });

