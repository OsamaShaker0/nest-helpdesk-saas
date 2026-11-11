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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalHttpExceptionsFilter } from './common/filters/http-exception.filter.js';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import jwtConfig from './config/jwt.config.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './auth/guards/authentication.guard.js';
import { MembershipsModule } from './memberships/memberships.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { PaginationModule } from './pagination/pagination.module.js';
import paginationConfig from './config/pagination.config.js';
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        paginationConfig,
      ],
      validationSchema: joiValidations,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),

        signOptions: {
          issuer: configService.getOrThrow<string>('jwt.issuer'),
          audience: configService.getOrThrow<string>('jwt.audience'),
          expiresIn: configService.getOrThrow<number>('jwt.ttl'),
        },
      }),
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
    UsersModule,
    AuthModule,
    TenantsModule,
    MembershipsModule,
    PaginationModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalHttpExceptionsFilter },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('{*path}');
  }
}
