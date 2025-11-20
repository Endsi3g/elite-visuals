import { createClient } from 'redis';

type CacheConfig = {
  ttl?: number; // Time to live in seconds
};

class CacheService {
  private static instance: CacheService;
  private client: any;
  private memoryCache: Map<string, { value: any; expiry: number }>;
  private isRedisEnabled: boolean;

  private constructor() {
    this.memoryCache = new Map();
    this.isRedisEnabled = !!process.env.REDIS_URL;

    if (this.isRedisEnabled) {
      this.client = createClient({
        url: process.env.REDIS_URL
      });
      this.client.on('error', (err: any) => console.error('Redis Client Error', err));
      this.client.connect().catch(console.error);
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async set(key: string, value: any, config?: CacheConfig): Promise<void> {
    const ttl = config?.ttl || 3600; // Default 1 hour

    if (this.isRedisEnabled && this.client?.isOpen) {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });
    } else {
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + ttl * 1000,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisEnabled && this.client?.isOpen) {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } else {
      const item = this.memoryCache.get(key);
      if (!item) return null;

      if (Date.now() > item.expiry) {
        this.memoryCache.delete(key);
        return null;
      }

      return item.value as T;
    }
  }

  async del(key: string): Promise<void> {
    if (this.isRedisEnabled && this.client?.isOpen) {
      await this.client.del(key);
    } else {
      this.memoryCache.delete(key);
    }
  }

  async flush(): Promise<void> {
    if (this.isRedisEnabled && this.client?.isOpen) {
      await this.client.flushAll();
    } else {
      this.memoryCache.clear();
    }
  }
}

export const cacheService = CacheService.getInstance();
