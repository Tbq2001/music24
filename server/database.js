import sql from "mssql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // Use based on your setup
    trustServerCertificate: true, // Useful for local development or self-signed certificates
  },
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined, // Optional port
};

// Check for missing environment variables
if (!dbConfig.user || !dbConfig.password || !dbConfig.server || !dbConfig.database) {
  console.error("Missing required database environment variables");
  process.exit(1); // Exit the application if configuration is incomplete
}

// Global connection pool
let poolPromise = null;

export function getConnectionPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig)
      .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
      })
      .catch(err => {
        console.error('Database connection failed:', err.message);
        poolPromise = null; // Reset if connection fails
        throw err;
      });
  }
  return poolPromise;
}
