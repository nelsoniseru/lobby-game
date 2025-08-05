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
        console.log(session);
        return this.gameModel.create(session);
    }
    async findById(sessionId) {
        this.logger.log(`Finding game session by ID: ${sessionId}`);
        return this.gameModel.findOne({ sessionId }).exec();
    }
    async update(sessionId, updateFields) {
        this.logger.log(`Updating game session: ${sessionId}`);
        const updatedSession = await this.gameModel
            .findOneAndUpdate({ sessionId }, updateFields, { new: true })
            .exec();
        if (!updatedSession) {
            this.logger.warn(`Session not found for update: ${sessionId}`);
            throw new Error(`Session ${sessionId} not found`);
        }
        return updatedSession;
    }
    async findActiveSession() {
        this.logger.log(`Finding active session`);
        return this.gameModel.findOne({ status: 'active' }).exec();
    }
    async getTopPlayers(limit, filter = 'all') {
        this.logger.log(`Fetching top ${limit} players with filter: ${filter}`);
        const now = new Date();
        const matchStage = { status: 'ended' };
        if (filter === 'day') {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            matchStage.createdAt = {
                $gte: new Date(startOfDay.getTime() - 1 * 60 * 60 * 1000),
                $lte: new Date(startOfDay.getTime() + (23 * 60 + 59) * 60 * 1000 + 999 - 1 * 60 * 60 * 1000)
            };
        }
        else if (filter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchStage.createdAt = { $gte: new Date(weekAgo.getTime() - 1 * 60 * 60 * 1000) };
        }
        else if (filter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            matchStage.createdAt = {
                $gte: new Date(startOfMonth.getTime() - 1 * 60 * 60 * 1000),
                $lte: new Date(endOfMonth.getTime() - 1 * 60 * 60 * 1000)
            };
        }
        return this.gameModel.aggregate([
            { $match: matchStage },
            { $unwind: '$players' },
            {
                $match: {
                    $expr: { $eq: ['$players.number', '$winningNumber'] }
                }
            },
            {
                $group: {
                    _id: '$players.userId',
                    wins: { $sum: 1 },
                    lastWinDate: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $sort: { wins: -1 } },
            { $limit: limit },
            {
                $project: {
                    name: '$user.username',
                    wins: 1,
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$lastWinDate'
                        }
                    }
                }
            }
        ]).exec();
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