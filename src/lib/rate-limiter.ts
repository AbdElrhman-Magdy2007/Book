interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }>;
  private windowMs: number;
  private max: number;

  constructor(options: RateLimiterOptions) {
    this.store = new Map();
    this.windowMs = options.windowMs;
    this.max = options.max;
  }

  async check(key: string): Promise<boolean> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (record.count >= this.max) {
      return true;
    }

    record.count++;
    return false;
  }
} 