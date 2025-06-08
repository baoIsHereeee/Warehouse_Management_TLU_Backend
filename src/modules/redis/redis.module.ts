import { Module, Global } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(configService.get('REDIS_URL'))
          ]
        };
      },
    })
  ]
})
export class RedisModule {}
