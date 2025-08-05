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
var GameMongoRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMongoRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_2 = require("@nestjs/common");
let GameMongoRepository = GameMongoRepository_1 = class GameMongoRepository {
    gameModel;
    logger = new common_2.Logger(GameMongoRepository_1.name);
    constructor(gameModel) {
        this.gameModel = gameModel;
    }
    async create(session) {
        this.logger.log(`Creating game session: ${session.sessionId}`);
        return this.gameModel.create(session);
    }
    async findById(sessionId) {
        this.logger.log(`Finding game session by ID: ${sessionId}`);
        return this.gameModel.findOne({ sessionId }).exec();
    }
    async update(session) {
        this.logger.log(`Updating game session: ${session.sessionId}`);
        const updatedSession = await this.gameModel
            .findOneAndUpdate({ sessionId: session.sessionId }, session, { new: true })
            .exec();
        if (!updatedSession) {
            this.logger.warn(`Session not found for update: ${session.sessionId}`);
            throw new Error(`Session ${session.sessionId} not found`);
        }
        return updatedSession;
    }
    async findActiveSessionByUserId(userId) {
        this.logger.log(`Finding active session for user: ${userId}`);
        return this.gameModel.findOne({ 'players.userId': userId, status: 'active' }).exec();
    }
    async getTopPlayers(limit) {
        this.logger.log(`Fetching top ${limit} players`);
        return this.gameModel
            .aggregate([
            { $unwind: '$players' },
            { $match: { 'players.number': { $eq: '$winningNumber' } } },
            { $group: { _id: '$players.userId', wins: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $sort: { wins: -1 } },
            { $limit: limit },
            { $project: { username: '$user.username', wins: 1 } },
        ])
            .exec();
    }
    async getSessionsByDate() {
        this.logger.log('Fetching sessions grouped by date');
        return this.gameModel
            .aggregate([
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, sessions: { $push: '$$ROOT' } } },
        ])
            .exec();
    }
};
exports.GameMongoRepository = GameMongoRepository;
exports.GameMongoRepository = GameMongoRepository = GameMongoRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('GameSession')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GameMongoRepository);
//# sourceMappingURL=game.repository.js.map