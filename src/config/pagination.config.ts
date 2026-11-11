import { registerAs } from '@nestjs/config';

export default registerAs('pagination', () => ({
  page: Number(process.env.PAGE),
  limit: Number(process.env.LIMIT),
}));
