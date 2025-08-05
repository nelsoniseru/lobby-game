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
var UserMongoRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongoRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_2 = require("@nestjs/common");
let UserMongoRepository = UserMongoRepository_1 = class UserMongoRepository {
    userModel;
    logger = new common_2.Logger(UserMongoRepository_1.name);
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByUsername(username) {
        this.logger.log(`Finding user by username: ${username}`);
        return this.userModel.findOne({ username }).exec();
    }
    async create(user) {
        this.logger.log(`Creating user: ${user.username}`);
        return this.userModel.create(user);
    }
    async incrementWins(userId) {
        this.logger.log(`Incrementing wins for user: ${userId}`);
        await this.userModel.updateOne({ _id: userId }, { $inc: { wins: 1 } }).exec();
    }
    async incrementloses(userId) {
        this.logger.log(`Incrementing loses for user: ${userId}`);
        await this.userModel.updateOne({ _id: userId }, { $inc: { loses: 1 } }).exec();
    }
    async find(id) {
        return this.userModel.findById(id).exec();
    }
    async findByIds(ids) {
        this.logger.log(`Finding users by IDs: ${ids.join(', ')}`);
        return this.userModel.find({ _id: { $in: ids } }).select('username wins loses').lean().exec();
    }
    async findById(id) {
        this.logger.log(`Finding user by ID: ${id}`);
        return this.userModel.findById(id).select('username wins losses').exec();
    }
};
exports.UserMongoRepository = UserMongoRepository;
exports.UserMongoRepository = UserMongoRepository = UserMongoRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserMongoRepository);
//# sourceMappingURL=user.repository.js.map