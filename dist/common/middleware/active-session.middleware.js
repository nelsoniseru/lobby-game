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
var ActiveSessionGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSessionGuard = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let ActiveSessionGuard = ActiveSessionGuard_1 = class ActiveSessionGuard {
    gameRepository;
    logger = new common_2.Logger(ActiveSessionGuard_1.name);
    constructor(gameRepository) {
        this.gameRepository = gameRepository;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (!req.user) {
            this.logger.error('No user found in request');
            throw new common_1.HttpException('User not authenticated', common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = req.user['id'];
        this.logger.log(`Checking active session for user: ${userId}`);
        const activeSession = await this.gameRepository.findActiveSessionByUserId(userId);
        if (activeSession) {
            this.logger.warn(`User ${userId} already in active session: ${activeSession.sessionId}`);
            throw new common_1.HttpException('User already in an active session', common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`No active session found for user: ${userId}`);
        return true;
    }
};
exports.ActiveSessionGuard = ActiveSessionGuard;
exports.ActiveSessionGuard = ActiveSessionGuard = ActiveSessionGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GameRepository')),
    __metadata("design:paramtypes", [Object])
], ActiveSessionGuard);
//# sourceMappingURL=active-session.middleware.js.map