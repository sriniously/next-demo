import Bull from 'bull';
import { redis } from './redis';

export const dataProcessingQueue = new Bull('data-processing', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return redis.duplicate();
      case 'subscriber':
        return redis.duplicate();
      case 'bclient':
        return redis.duplicate();
      default:
        return redis.duplicate();
    }
  },
});