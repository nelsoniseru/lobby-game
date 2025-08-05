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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionSchema = exports.GameSession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let GameSession = class GameSession extends mongoose_2.Document {
    sessionId;
    status;
    startTime;
    duration;
    winningNumber;
};
exports.GameSession = GameSession;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique session ID' }),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], GameSession.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', description: 'Session status', enum: ['active', 'ended'] }),
    (0, mongoose_1.Prop)({ required: true, enum: ['active', 'ended'] }),
    __metadata("design:type", String)
], GameSession.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-02T16:59:00.000Z', description: 'Session start time (ISO format)' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GameSession.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300000, description: 'Session duration in milliseconds' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GameSession.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Winning number (if session ended)', required: false }),
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], GameSession.prototype, "winningNumber", void 0);
exports.GameSession = GameSession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GameSession);
exports.GameSessionSchema = mongoose_1.SchemaFactory.createForClass(GameSession);
//# sourceMappingURL=game.schema.js.map