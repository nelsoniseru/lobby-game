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
var GameController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = exports.StandardResponse = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("../domain/game.service");
const jwt_auth_guard_1 = require("../../auth/adapters/jwt-auth.guard");
const active_session_middleware_1 = require("../../../common/middleware/active-session.middleware");
const joi_validation_pipe_1 = require("../../../common/pipes/joi-validation.pipe");
const response_format_1 = require("../../../common/responses/response.format");
const game_dto_1 = require("../../../common/dto/game.dto");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
class StandardResponse {
    status;
    data;
}
exports.StandardResponse = StandardResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Request status' }),
    __metadata("design:type", Boolean)
], StandardResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response data' }),
    __metadata("design:type", Object)
], StandardResponse.prototype, "data", void 0);
let GameController = GameController_1 = class GameController {
    gameService;
    logger = new common_2.Logger(GameController_1.name);
    constructor(gameService) {
        this.gameService = gameService;
    }
    async startSession(req) {
        this.logger.log(`User ${req.user.id} starting new session`);
        try {
            const session = await this.gameService.startSession(req.user.id);
            this.logger.log(`Session started: ${session.sessionId}`);
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.CREATED, { session });
        }
        catch (error) {
            this.logger.error(`Failed to start session: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
    async joinSession(req, dto) {
        this.logger.log(`User ${req.user.id} joining session: ${dto.sessionId}`);
        try {
            const session = await this.gameService.joinSession(dto.sessionId, req.user.id, dto.number);
            this.logger.log(`User ${req.user.id} joined session: ${dto.sessionId}`);
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { session });
        }
        catch (error) {
            this.logger.error(`Failed to join session: ${error.message}`);
            return response_format_1.ResponseFormat.error(error.status || common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
    async leaveSession(req, body) {
        this.logger.log(`User ${req.user.id} leaving session: ${body.sessionId}`);
        try {
            const session = await this.gameService.leaveSession(body.sessionId, req.user.id);
            this.logger.log(`User ${req.user.id} left session: ${body.sessionId}`);
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { session });
        }
        catch (error) {
            this.logger.error(`Failed to leave session: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
    async getLeaderboard() {
        this.logger.log('Fetching leaderboard');
        try {
            const topPlayers = await this.gameService.getTopPlayers(10);
            this.logger.log('Leaderboard fetched successfully');
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { topPlayers });
        }
        catch (error) {
            this.logger.error(`Failed to fetch leaderboard: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
    async getSessionsByDate() {
        this.logger.log('Fetching sessions by date');
        try {
            const sessions = await this.gameService.getSessionsByDate();
            this.logger.log('Sessions by date fetched successfully');
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { sessions });
        }
        catch (error) {
            this.logger.error(`Failed to fetch sessions by date: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, active_session_middleware_1.ActiveSessionGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new game session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session started successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already in an active session', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, active_session_middleware_1.ActiveSessionGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Join an existing game session' }),
    (0, swagger_1.ApiBody)({ type: game_dto_1.JoinSessionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session joined successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Session not active or user already in session', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(game_dto_1.JoinSessionDtoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "joinSession", null);
__decorate([
    (0, common_1.Post)('leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a game session' }),
    (0, swagger_1.ApiBody)({ type: game_dto_1.LeaveSessionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session left successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Session not active', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(game_dto_1.LeaveSessionDtoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "leaveSession", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top players leaderboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Leaderboard retrieved successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('sessions-by-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sessions grouped by date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sessions retrieved successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getSessionsByDate", null);
exports.GameController = GameController = GameController_1 = __decorate([
    (0, swagger_1.ApiTags)('game'),
    (0, common_1.Controller)('game'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map