import { registerAs } from '@nestjs/config';

export default registerAs('caching', () => {
  return {
    host: process.env.CACHE_HOST,
    port: parseInt(process.env.CACHE_PORT, 10) || 6439,
  };
});
