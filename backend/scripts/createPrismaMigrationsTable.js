import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createPrismaMigrationsTable() {
  console.log('Starting Prisma migrations table setup...');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('DATABASE_URL found, parsing connection string...');

  // Parse the MySQL connection string
  // Format: mysql://user:password@host:port/database
  let config;
  try {
    // Handle both mysql:// and mysql2:// protocols
    const urlString = connectionString.replace(/^mysql2?:\/\//, 'http://');
    const url = new URL(urlString);
    
    config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password || ''),
      database: url.pathname.slice(1), // Remove leading slash
    };
    console.log(`Connecting to database: ${config.database} on ${config.host}:${config.port}`);
  } catch (error) {
    console.error('ERROR: Error parsing DATABASE_URL:', error.message);
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database successfully');
    
    // Check if the table already exists
    const [tables] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = '_prisma_migrations'`,
      [config.database]
    );

    const tableExists = tables[0].count > 0;
    console.log(`Table _prisma_migrations exists: ${tableExists}`);

    if (tableExists) {
      // Check if the table has the wrong schema (DATETIME(3))
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, COLUMN_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = '_prisma_migrations'
        AND COLUMN_TYPE LIKE '%DATETIME%'
      `, [config.database]);

      let needsRecreation = false;
      for (const col of columns) {
        if (col.COLUMN_TYPE.includes('DATETIME(3)')) {
          console.log(`Found column ${col.COLUMN_NAME} with DATETIME(3), table needs to be recreated`);
          needsRecreation = true;
          break;
        }
      }

      if (needsRecreation) {
        console.log('Dropping existing _prisma_migrations table to recreate with correct schema...');
        await connection.execute('DROP TABLE IF EXISTS `_prisma_migrations`');
        console.log('Table dropped successfully');
      } else {
        console.log('_prisma_migrations table already exists with correct schema');
        return;
      }
    }

    // Create the _prisma_migrations table with DATETIME (without precision)
    console.log('Creating _prisma_migrations table with DATETIME (no precision)...');
    await connection.execute(`
      CREATE TABLE \`_prisma_migrations\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`checksum\` VARCHAR(64) NOT NULL,
        \`finished_at\` DATETIME NULL,
        \`migration_name\` VARCHAR(255) NOT NULL,
        \`logs\` TEXT NULL,
        \`rolled_back_at\` DATETIME NULL,
        \`started_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('✓ Successfully created _prisma_migrations table');
    
    // Verify the table was created correctly
    const [verifyTables] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = '_prisma_migrations'`,
      [config.database]
    );
    
    if (verifyTables[0].count === 0) {
      throw new Error('Table creation verification failed - table does not exist');
    }
    
    // Verify the schema is correct (no DATETIME(3))
    const [verifyColumns] = await connection.execute(`
      SELECT COLUMN_NAME, COLUMN_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = '_prisma_migrations'
      AND COLUMN_TYPE LIKE '%DATETIME%'
    `, [config.database]);
    
    for (const col of verifyColumns) {
      if (col.COLUMN_TYPE.includes('DATETIME(3)')) {
        throw new Error(`Table verification failed - column ${col.COLUMN_NAME} still has DATETIME(3)`);
      }
    }
    
    console.log('✓ Table verification passed - schema is correct');
  } catch (error) {
    // If table already exists, that's fine
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('_prisma_migrations table already exists');
    } else {
      console.error('ERROR: Error creating _prisma_migrations table:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

createPrismaMigrationsTable()
  .then(() => {
    console.log('Migration table setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create migration table:', error);
    process.exit(1);
  });

