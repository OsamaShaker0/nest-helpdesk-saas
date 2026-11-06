import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service.js';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
@Global()
@Module({
  providers: [CacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [createKeyv(configService.getOrThrow<string>('redis.url'))],
      }),
    }),
  ],
  exports: [CacheService],
})
export class CacheRedisModule {}
