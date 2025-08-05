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
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const inspector_1 = require("inspector");
let GameService = GameService_1 = class GameService {
    gameRepository;
    userRepository;
    playerRepository;
    connection;
    configService;
    logger = new common_2.Logger(GameService_1.name);
    queue = [];
    constructor(gameRepository, userRepository, playerRepository, connection, configService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.playerRepository = playerRepository;
        this.connection = connection;
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
    async startSession() {
        this.logger.log(`Starting new session for user`);
        const sessionDuration = this.configService.get('SESSION_DURATION_SECONDS');
        const session = await this.gameRepository.create({
            sessionId: (0, uuid_1.v4)(),
            status: 'active',
            startTime: new Date(),
            duration: sessionDuration * 1000,
            winningNumber: Math.floor(Math.random() * 9) + 1,
        });
        inspector_1.console.log(session);
        this.logger.log(`Session started: ${session.sessionId}`);
        return session;
    }
    async joinSession(sessionId, id) {
        this.logger.log(`User ${id} attempting to join session: ${sessionId}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Session not active: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        const sessionUserCap = this.configService.get('SESSION_USER_CAP');
        const playerCount = await this.playerRepository.count({ sessionId });
        if (playerCount >= sessionUserCap) {
            this.queue.push(id);
            this.logger.log(`Session full, user ${id} added to queue`);
            throw new common_1.HttpException('Session full, added to queue', common_1.HttpStatus.OK);
        }
        const existingPlayer = await this.playerRepository.findOne({ id, sessionId });
        if (existingPlayer) {
            this.logger.warn(`User ${id} already in session: ${sessionId}`);
            throw new common_1.HttpException('User already in session', common_1.HttpStatus.BAD_REQUEST);
        }
        const newPlayer = await this.playerRepository.create({
            userId: id,
            sessionId,
        });
        this.logger.log(`User ${id} joined session: ${sessionId}`);
        return newPlayer;
    }
    async leaveSession(sessionId, userId) {
        this.logger.log(`User ${userId} attempting to leave session: ${sessionId}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Session not active: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.playerRepository.softDelete({ sessionId, userId });
        this.logger.log(`User ${userId} removed from session: ${sessionId}`);
        const sessionUserCap = this.configService.get('SESSION_USER_CAP');
        const currentCount = await this.playerRepository.count({ sessionId });
        if (this.queue.length > 0 && currentCount < sessionUserCap) {
            const nextUserId = this.queue.shift();
            this.logger.log(`Adding queued user ${nextUserId} to session: ${sessionId}`);
            await this.playerRepository.create({
                userId: nextUserId,
                number: null,
                sessionId,
                deleted: false,
            });
            this.logger.log(`Queued user ${nextUserId} joined session: ${sessionId}`);
        }
    }
    async getPlayerCount(sessionId) {
        const count = await this.playerRepository.count({ sessionId });
        return count;
    }
    async getTopPlayers(limit, filter) {
        this.logger.log(`Fetching top ${limit} players`);
        return this.gameRepository.getTopPlayers(limit);
    }
    async getSessionsByDate() {
        this.logger.log('Fetching sessions grouped by date');
        return this.gameRepository.getSessionsByDate();
    }
    async submitPlayerNumber(sessionId, userId, number) {
        this.logger.log(`Submitting number ${number} for user ${userId} in session ${sessionId}`);
        const session = await this.gameRepository.findById(sessionId);
        if (!session || session.status !== 'active') {
            this.logger.warn(`Cannot submit number — session not active or not found: ${sessionId}`);
            throw new common_1.HttpException('Session not active', common_1.HttpStatus.BAD_REQUEST);
        }
        const player = await this.playerRepository.findOne({ userId, sessionId });
        if (!player) {
            this.logger.warn(`User ${userId} not found in session ${sessionId}`);
            throw new common_1.HttpException('User not in session', common_1.HttpStatus.NOT_FOUND);
        }
        if (player.number !== undefined && player.number !== null) {
            this.logger.warn(`User ${userId} already submitted a number`);
            throw new common_1.HttpException('Number already submitted', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.playerRepository.update({ userId, sessionId }, { number });
        this.logger.log(`Number ${number} submitted successfully for user ${userId} in session ${sessionId}`);
        const winningNumber = session.winningNumber;
        if (winningNumber === undefined || winningNumber === null) {
            this.logger.warn(`Winning number not yet defined for session ${sessionId}`);
        }
        else if (number === winningNumber) {
            await this.userRepository.incrementWins(userId);
            this.logger.log(`User ${userId} guessed correctly! Winning number: ${winningNumber}`);
        }
        else {
            await this.userRepository.incrementloses(userId);
            this.logger.log(`User ${userId} guessed ${number}, but winning number was ${winningNumber}`);
        }
        return {
            message: 'Number accepted for session.'
        };
    }
    async getActiveUsers(sessionId) {
        this.logger.log(`Fetching active users for session: ${sessionId}`);
        const players = await this.playerRepository.find({ sessionId, deleted: false });
        const userIds = players.map((player) => player.userId);
        const users = await this.userRepository.findByIds(userIds);
        return users.map((user) => user.username);
    }
    async getWinners(sessionId) {
        this.logger.log(`Fetching winners for session: ${sessionId}`);
        inspector_1.console.log(sessionId);
        const session = await this.gameRepository.findById(sessionId);
        if (!session) {
            this.logger.warn(`Session not ended or not found: ${sessionId}`);
            return [];
        }
        const players = await this.playerRepository.find({
            sessionId,
            number: session.winningNumber,
        });
        const userIds = players.map((player) => player.userId);
        const users = await this.userRepository.findByIds(userIds);
        inspector_1.console.log(users);
        return users.map((user) => user.username);
    }
    async getWinCount(sessionId) {
        this.logger.log(`Fetching win count for session: ${sessionId}`);
        inspector_1.console.log(sessionId);
        const session = await this.gameRepository.findById(sessionId);
        if (!session) {
            this.logger.warn(`Session not ended or not found: ${sessionId}`);
            return 0;
        }
        return this.playerRepository.count({
            sessionId,
            number: session.winningNumber,
        });
    }
    async getUserTotalWins(userId) {
        this.logger.log(`Fetching total wins for user: ${userId}`);
        const user = await this.userRepository.find(userId);
        if (!user) {
            this.logger.warn(`User not found: ${userId}`);
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user.wins || 0;
    }
    async getUserTotalLosses(userId) {
        this.logger.log(`Fetching total losses for user: ${userId}`);
        const user = await this.userRepository.find(userId);
        if (!user) {
            this.logger.warn(`User not found: ${userId}`);
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user.loses || 0;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = GameService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GameRepository')),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __param(2, (0, common_1.Inject)('PlayerRepository')),
    __param(3, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [Object, Object, Object, mongoose_1.Connection,
        config_1.ConfigService])
], GameService);
//# sourceMappingURL=game.service.js.map