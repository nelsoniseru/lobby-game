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
var GameService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const common_2 = require("@nestjs/common");
let GameService = GameService_1 = class GameService {
    gameRepository;
    userRepository;
    configService;
    logger = new common_2.Logger(GameService_1.name);
    queue = [];
    constructor(gameRepository, userRepository, configService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.configService = configService;
        this.validateConfig();
    }
    validateConfig() {
        const sessionDuration = this.configService.get('SESSION_DURATION_SECONDS');
        const sessionUserCap = this.configService.get('SESSION_USER_CAP');
        if (sessionDuration === undefined) {
            this.logger.error('SESSION_DURATION_SECONDS is not defined in configuration');
            throw new Error('Missing configuration: SESSION_DURATION_SECONDS');
        }
        if (sessionUserCap === undefined) {
            this.logger.error('SESSION_USER_CAP is not defined in configuration');
            throw new Error('Missing configuration: SESSION_USER_CAP');
        }
    }
    async startSession(userId) {
        this.logger.log(`Starting new session for user: ${userId}`);
        const sessionDuration = this.configService.get('SESSION_DURATION_SECONDS');
        const session = await this.gameRepository.create({
            sessionId: (0, uuid_1.v4)(),
            creatorId: userId,
            players: [{ userId, number: null }],
            status: 'active',
            startTime: new Date(),
            duration: sessionDuration * 1000,
        });
        this.logger.log(`Session started: ${session.sessionId}`);
        setTimeout(() => {
            this.endSession(session.sessionId).catch((err) => this.logger.error(`Failed to end session ${session.sessionId}: ${err.message}`));
        }, session.duration);
        return session;
    }
    async joinSession(sessionId, userId, number) {
        this.logger.log(`User ${userId} attempting to join session: ${sessionId} with number: ${number}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Session not active: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        const sessionUserCap = this.configService.get('SESSION_USER_CAP');
        if (session.players.length >= sessionUserCap) {
            this.queue.push(userId);
            this.logger.log(`Session full, user ${userId} added to queue`);
            throw new common_1.HttpException('Session full, added to queue', common_1.HttpStatus.OK);
        }
        if (session.players.some((p) => p.userId === userId)) {
            this.logger.warn(`User ${userId} already in session: ${sessionId}`);
            throw new common_1.HttpException('User already in session', common_1.HttpStatus.BAD_REQUEST);
        }
        session.players.push({ userId, number });
        const updatedSession = await this.gameRepository.update(session);
        if (!updatedSession) {
            this.logger.warn(`Failed to update session: ${sessionId}`);
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        }
        this.logger.log(`User ${userId} joined session: ${sessionId}`);
        return updatedSession;
    }
    async leaveSession(sessionId, userId) {
        this.logger.log(`User ${userId} attempting to leave session: ${sessionId}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Session not active: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        session.players = session.players.filter((p) => p.userId !== userId);
        if (this.queue.length > 0) {
            const nextUserId = this.queue.shift();
            this.logger.log(`Adding queued user ${nextUserId} to session: ${sessionId}`);
            session.players.push({ userId: nextUserId, number: null });
        }
        const updatedSession = await this.gameRepository.update(session);
        if (!updatedSession) {
            this.logger.warn(`Failed to update session: ${sessionId}`);
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        }
        this.logger.log(`User ${userId} left session: ${sessionId}`);
        return updatedSession;
    }
    async endSession(sessionId) {
        this.logger.log(`Ending session: ${sessionId}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Session not active: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        const winningNumber = Math.floor(Math.random() * 9) + 1;
        session.winningNumber = winningNumber;
        session.status = 'ended';
        const winners = session.players
            .filter((p) => p.number === winningNumber)
            .map((p) => p.userId);
        for (const winnerId of winners) {
            this.logger.log(`Incrementing wins for winner: ${winnerId}`);
            await this.userRepository.incrementWins(winnerId);
        }
        const updatedSession = await this.gameRepository.update(session);
        if (!updatedSession) {
            this.logger.warn(`Failed to update session: ${sessionId}`);
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        }
        this.logger.log(`Session ${sessionId} ended with winning number: ${winningNumber}`);
        return { session: updatedSession, winners };
    }
    async getTopPlayers(limit) {
        this.logger.log(`Fetching top ${limit} players`);
        return this.gameRepository.getTopPlayers(limit);
    }
    async getSessionsByDate() {
        this.logger.log('Fetching sessions grouped by date');
        return this.gameRepository.getSessionsByDate();
    }
};
exports.GameService = GameService;
exports.GameService = GameService = GameService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GameRepository')),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, Object, config_1.ConfigService])
], GameService);
//# sourceMappingURL=game.service.js.map