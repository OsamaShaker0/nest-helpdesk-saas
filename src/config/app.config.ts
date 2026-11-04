import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  apiVersion: process.env.API_VERSION ,
}));
