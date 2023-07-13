export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  cache: {
    host: process.env.CACHE_HOST,
    port: parseInt(process.env.CACHE_PORT, 10) || 6439,
  },
});
