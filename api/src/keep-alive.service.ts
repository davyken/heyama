import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnApplicationBootstrap {
  private readonly logger = new Logger(KeepAliveService.name);
  private readonly PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

  onApplicationBootstrap() {
    this.startPinging();
  }

  private startPinging() {
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3001}`;
    
    this.logger.log(`Starting keep-alive ping for ${url}`);

    setInterval(async () => {
      try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
          this.logger.log(`Keep-alive ping successful: ${response.status}`);
        } else {
          this.logger.warn(`Keep-alive ping failed: ${response.statusText}`);
        }
      } catch (error) {
        this.logger.error(`Keep-alive ping error: ${error.message}`);
      }
    }, this.PING_INTERVAL);
  }
}
