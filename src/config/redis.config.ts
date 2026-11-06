import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    url:process.env.REDIS_URL

}));
