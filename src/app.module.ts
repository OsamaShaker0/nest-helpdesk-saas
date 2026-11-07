import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import joiValidations from './config/joi.validations.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheRedisModule } from './cache/cache.module.js';
import redisConfig from './config/redis.config.js';
import { APP_FILTER } from '@nestjs/core';
import { GlobalHttpExceptionsFilter } from './common/filters/http-exception.filter.js';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware.js';
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, redisConfig],
      validationSchema: joiValidations,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('database.host'),
        port: configService.getOrThrow('database.port'),
        username: configService.getOrThrow('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow('database.name'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CacheRedisModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalHttpExceptionsFilter },
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('{*path}');
  }
}
