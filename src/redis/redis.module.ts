import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            ttl: 60 * 60 * 24, 
        })
    }),
  ],
  providers: [RedisService],
  exports: [CacheModule, RedisService],
})
export class RedisModule {} 