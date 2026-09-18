const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    return delay;
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✓ Redis connected');
});

redis.on('error', (err) => {
  console.error('✗ Redis connection error:', err.message);
});

module.exports = redis;
