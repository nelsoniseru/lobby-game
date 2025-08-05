"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsByDateResponse = exports.LeaderboardResponse = exports.GameSessionResponse = exports.LeaveSessionDto = exports.JoinSessionDto = exports.LeaveSessionDtoSchema = exports.JoinSessionDtoSchema = void 0;
const Joi = __importStar(require("joi"));
const swagger_1 = require("@nestjs/swagger");
exports.JoinSessionDtoSchema = Joi.object({
    sessionId: Joi.string().required(),
    number: Joi.number().min(1).max(9).required(),
});
exports.LeaveSessionDtoSchema = Joi.object({
    sessionId: Joi.string().required(),
});
class JoinSessionDto {
    sessionId;
    number;
}
exports.JoinSessionDto = JoinSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' }),
    __metadata("design:type", String)
], JoinSessionDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'The number chosen by the player (1-9)' }),
    __metadata("design:type", Number)
], JoinSessionDto.prototype, "number", void 0);
class LeaveSessionDto {
    sessionId;
}
exports.LeaveSessionDto = LeaveSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' }),
    __metadata("design:type", String)
], LeaveSessionDto.prototype, "sessionId", void 0);
class GameSessionResponse {
    sessionId;
    creatorId;
    players;
    status;
    startTime;
    duration;
    id;
    winningNumber;
}
exports.GameSessionResponse = GameSessionResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The session ID' }),
    __metadata("design:type", String)
], GameSessionResponse.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', description: 'The ID of the session creator' }),
    __metadata("design:type", String)
], GameSessionResponse.prototype, "creatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ userId: 'user123', number: null }, { userId: 'user456', number: 5 }],
        description: 'List of players in the session',
    }),
    __metadata("design:type", Array)
], GameSessionResponse.prototype, "players", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', description: 'Session status', enum: ['active', 'ended'] }),
    __metadata("design:type", String)
], GameSessionResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-02T16:59:00.000Z', description: 'Session start time' }),
    __metadata("design:type", String)
], GameSessionResponse.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300000, description: 'Session duration in milliseconds' }),
    __metadata("design:type", Number)
], GameSessionResponse.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'session123', description: 'Internal session ID' }),
    __metadata("design:type", String)
], GameSessionResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Winning number (if session ended)', required: false }),
    __metadata("design:type", Number)
], GameSessionResponse.prototype, "winningNumber", void 0);
class LeaderboardResponse {
    topPlayers;
}
exports.LeaderboardResponse = LeaderboardResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ username: 'gameuser', wins: 5 }],
        description: 'List of top players with their win counts',
    }),
    __metadata("design:type", Array)
], LeaderboardResponse.prototype, "topPlayers", void 0);
class SessionsByDateResponse {
    sessions;
}
exports.SessionsByDateResponse = SessionsByDateResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                _id: '2025-08-02',
                sessions: [
                    {
                        sessionId: '123e4567-e89b-12d3-a456-426614174000',
                        creatorId: 'user123',
                        players: [{ userId: 'user123', number: null }, { userId: 'user456', number: 5 }],
                        status: 'active',
                        startTime: '2025-08-02T16:59:00.000Z',
                        duration: 300000,
                        id: 'session123',
                    },
                ],
            },
        ],
        description: 'Sessions grouped by date in YYYY-MM-DD format',
    }),
    __metadata("design:type", Array)
], SessionsByDateResponse.prototype, "sessions", void 0);
//# sourceMappingURL=game.dto.js.map