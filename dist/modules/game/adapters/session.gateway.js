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
var SessionGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const game_service_1 = require("../domain/game.service");
let SessionGateway = SessionGateway_1 = class SessionGateway {
    gameService;
    server;
    constructor(gameService) {
        this.gameService = gameService;
    }
    logger = new common_1.Logger(SessionGateway_1.name);
    afterInit() {
        this.logger.log('WebSocket Gateway initialized');
    }
    emitSessionCountdown(seconds) {
        this.logger.log(`Emitting session countdown: ${seconds} seconds`);
        this.server.emit('sessionCountdown', { seconds });
    }
    emitDelayCountdown(seconds) {
        this.logger.log(`Emitting delay countdown: ${seconds} seconds`);
        this.server.emit('delayCountdown', { seconds });
    }
    emitNewSession(sessionId) {
        this.logger.log(`Emitting new session: ${sessionId}`);
        this.server.emit('newSession', { sessionId });
    }
    emitSessionEnd(sessionId, winningNumber) {
        this.logger.log(`Emitting session end: ${sessionId}`);
        this.server.emit('sessionEnd', { sessionId, winningNumber });
    }
    async handleJoinRoom(data) {
        this.logger.log(`Client ${data.id} requested to join session ${data.sessionId} `);
        try {
            const user = await this.gameService.joinSession(data.sessionId, data.id);
            this.server.emit('joinSuccess', { user });
        }
        catch (error) {
            this.logger.error(`JoinRoom error: ${error.message}`);
            this.server.to(data.sessionId).emit('joinError', { message: error.message });
        }
    }
    async broadcastPlayerCount(data) {
        const { sessionId } = data;
        try {
            const count = await this.gameService.getPlayerCount(sessionId);
            this.server.emit('playerSuccess', { sessionId, count });
        }
        catch (error) {
            this.server.to(sessionId).emit('playerError', { message: error.message });
        }
    }
    async handleGetSessionData(data) {
        const { sessionId, userId } = data;
        try {
            const activeUsers = await this.gameService.getActiveUsers(sessionId);
            const winners = await this.gameService.getWinners(sessionId);
            const playerCount = await this.gameService.getPlayerCount(sessionId);
            const winCount = await this.gameService.getWinCount(sessionId);
            this.server.emit('sessionSuccess', {
                sessionId,
                activeUsers,
                winners,
                playerCount,
                winCount
            });
        }
        catch (error) {
            this.logger.error(`GetSessionData error: ${error.message}`);
            this.server.to(sessionId).emit('sessionError', { message: error.message });
        }
    }
    async handleUserData(data, client) {
        const { userId } = data;
        try {
            const totalWins = await this.gameService.getUserTotalWins(userId);
            const totalLosses = await this.gameService.getUserTotalLosses(userId);
            client.emit('userSuccess', {
                totalWins,
                totalLosses,
            });
        }
        catch (error) {
            this.logger.error(`userData error: ${error.message}`);
            client.emit('userError', { message: error.message });
        }
    }
};
exports.SessionGateway = SessionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SessionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playerCount'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "broadcastPlayerCount", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getSessionData'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "handleGetSessionData", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUserData'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SessionGateway.prototype, "handleUserData", null);
exports.SessionGateway = SessionGateway = SessionGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'game',
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], SessionGateway);
//# sourceMappingURL=session.gateway.js.map