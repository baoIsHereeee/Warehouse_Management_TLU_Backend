import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get(key: string) {
        return await this.cacheManager.get(key);
    }

    async set(key: string, value: any, ttl?: number) {
        console.log(key, value, ttl);
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string) {
        await this.cacheManager.del(key);
    }

    async clear() {
        await this.cacheManager.clear();
    }

    async getKey() {
        await this.cacheManager.set('test-key123', 'test-value123');
        return await this.cacheManager.get('test-key');  
    }
} 