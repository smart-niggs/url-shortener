import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION } from './url/constants';

/**
 * Two segments on purpose. The catch-all `@Get('/:short_url')` in AppController is
 * single-segment, so `/health/...` can never be mistaken for a short code - no
 * reliance on route declaration order.
 */
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE_CONNECTION) private readonly mongoose: Mongoose) {}

  /**
   * Liveness touches nothing. This is what the ALB target group checks: if it
   * tested Mongo, one blip would mark every task unhealthy and kill the capacity
   * needed to recover.
   */
  @Get('live')
  live() {
    return { ok: true };
  }

  /**
   * Readiness reports whether the connection is usable. readyState is in-process
   * state, not a round trip - deliberately, so a probe every few seconds does not
   * become load on the database.
   * 0 disconnected, 1 connected, 2 connecting, 3 disconnecting.
   */
  @Get('ready')
  ready() {
    const state = this.mongoose.connection.readyState;
    if (state !== 1) {
      throw new ServiceUnavailableException(`mongo not ready (readyState=${state})`);
    }
    return { ok: true };
  }
}
