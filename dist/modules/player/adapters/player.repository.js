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
var PlayerMongoRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMongoRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const player_schema_1 = require("../entity/player.schema");
let PlayerMongoRepository = PlayerMongoRepository_1 = class PlayerMongoRepository {
    playerModel;
    logger = new common_1.Logger(PlayerMongoRepository_1.name);
    constructor(playerModel) {
        this.playerModel = playerModel;
    }
    async findOne(filter) {
        this.logger.log(`Finding player with filter: ${JSON.stringify(filter)}`);
        return this.playerModel.findOne(filter).exec();
    }
    async findById(id) {
        this.logger.log(`Finding player by ID: ${id}`);
        return this.playerModel.findById(id).exec();
    }
    async findByIds(ids) {
        this.logger.log(`Finding players by IDs: ${ids.join(', ')}`);
        return this.playerModel.find({ _id: { $in: ids } }).exec();
    }
    async find(filter) {
        this.logger.log(`Finding players with filter: ${JSON.stringify(filter)}`);
        return this.playerModel.find(filter).exec();
    }
    async findSession(sessionId) {
        this.logger.log(`Finding players in session: ${sessionId}`);
        return this.playerModel.find({ sessionId }).exec();
    }
    async count(filter) {
        this.logger.log(`Counting players with filter: ${JSON.stringify(filter)}`);
        return this.playerModel.countDocuments(filter).exec();
    }
    async create(data) {
        this.logger.log(`Creating player`);
        return this.playerModel.create(data);
    }
    async update(filter, updateData) {
        this.logger.log(`Updating player with filter: ${JSON.stringify(filter)}`);
        await this.playerModel.updateOne(filter, { $set: updateData }).exec();
    }
    async softDelete(filter) {
        this.logger.log(`Soft deleting player with filter: ${JSON.stringify(filter)}`);
        await this.playerModel.updateOne(filter, { deleted: true }).exec();
    }
};
exports.PlayerMongoRepository = PlayerMongoRepository;
exports.PlayerMongoRepository = PlayerMongoRepository = PlayerMongoRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(player_schema_1.Player.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlayerMongoRepository);
//# sourceMappingURL=player.repository.js.map