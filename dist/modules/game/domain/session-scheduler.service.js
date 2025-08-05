"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SessionSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const session_gateway_1 = require("../adapters/session.gateway");
const game_service_1 = require("../domain/game.service");
let SessionSchedulerService = SessionSchedulerService_1 = class SessionSchedulerService {
    gameRepository;
    configService;
    gameService;
    schedulerRegistry;
    sessionGateway;
    logger = new common_1.Logger(SessionSchedulerService_1.name);
    constructor(gameRepository, configService, gameService, schedulerRegistry, sessionGateway) {
        this.gameRepository = gameRepository;
        this.configService = configService;
        this.gameService = gameService;
        this.schedulerRegistry = schedulerRegistry;
        this.sessionGateway = sessionGateway;
        this.startSessionCron();
    }
    async startSessionCron() {
        const job = new cron_1.CronJob('*/90 * * * * *', async () => {
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
                    const duration = this.configService.get('SESSION_DURATION_SECONDS', 60);
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
                    }
                    else {
                        this.logger.log('Session is still active, not ending yet.');
                    }
                }
            }
            catch (error) {
                this.logger.error(`Cron job error: ${error.message}`);
            }
        });
        this.schedulerRegistry.addCronJob('start-session-cron', job);
        job.start();
        this.logger.log('Session cron job started');
    }
};
exports.SessionSchedulerService = SessionSchedulerService;
exports.SessionSchedulerService = SessionSchedulerService = SessionSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GameRepository')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService,
        game_service_1.GameService,
        schedule_1.SchedulerRegistry,
        session_gateway_1.SessionGateway])
], SessionSchedulerService);
//# sourceMappingURL=session-scheduler.service.js.map