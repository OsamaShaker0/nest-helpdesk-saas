import Joi  from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('test', 'production', 'development', 'stating')
    .default('development'),
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
 API_VERSION: Joi.string().required(),
});
