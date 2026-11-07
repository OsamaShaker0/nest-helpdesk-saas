import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.APP_PORT),
  apiVersion: process.env.API_VERSION,
  corsOrigin: process.env.CORS_ORIGIN,
}));
