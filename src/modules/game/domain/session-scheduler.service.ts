import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import type { GameRepository } from '../ports/game.repository';
import { SessionGateway } from '../adapters/session.gateway';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from '../domain/game.service';

@Injectable()
export class SessionSchedulerService {
  private readonly logger = new Logger(SessionSchedulerService.name);

  constructor(
    @Inject('GameRepository') private readonly gameRepository: GameRepository,
    private readonly configService: ConfigService,
    private readonly gameService: GameService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly sessionGateway: SessionGateway,
  ) {
    this.startSessionCron();
  }

  private async startSessionCron() {
    const job = new CronJob('*/90 * * * * *', async () => {
      try {
        const activeSession_ = await this.gameRepository.findActiveSession();
        if (!activeSession_) {
          for (let seconds = 30; seconds >= 0; seconds--) {
            this.sessionGateway.emitDelayCountdown(seconds);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          this.logger.log('Starting new session via cron');
          const session = await this.gameService.startSession();
          const active_id = session.sessionId;
          this.logger.log(`New session started: ${active_id}`);
          this.sessionGateway.emitNewSession(active_id);
          const duration = this.configService.get<number>('SESSION_DURATION_SECONDS', 60);
          for (let seconds = duration; seconds >= 0; seconds--) {
            this.sessionGateway.emitSessionCountdown(seconds);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

        }

        if (activeSession_) {
          const startTime = new Date(activeSession_.startTime).getTime();
          const endTime = startTime + activeSession_.duration;
          const now = Date.now();

          if (now >= endTime) {
            const winningNumber = Math.floor(Math.random() * 9) + 1;
            this.logger.log(`Ending session via timeout: ${activeSession_.sessionId}`);

            await this.gameRepository.update(activeSession_.sessionId, {
              status: 'ended',
              winningNumber,
            });

            this.sessionGateway.emitSessionEnd(activeSession_.sessionId, winningNumber);
          } else {
            this.logger.log('Session is still active, not ending yet.');
          }
        }

      } catch (error) {
        this.logger.error(`Cron job error: ${error.message}`);
      }
    });

    this.schedulerRegistry.addCronJob('start-session-cron', job);
    job.start();
    this.logger.log('Session cron job started');
  }
}