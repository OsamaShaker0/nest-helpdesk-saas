import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('test', 'production', 'development', 'staging')
    .default('development'),
  APP_PORT: Joi.number().port().default(3000),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_URL: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_TTL: Joi.number().required(),
  REFRESH_TOKEN_TTL:Joi.number().required(),
});
