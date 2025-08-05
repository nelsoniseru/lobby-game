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
exports.PlayerSchema = exports.Player = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let Player = class Player extends mongoose_2.Document {
    userId;
    number;
    sessionId;
    deleted;
};
exports.Player = Player;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', description: 'The ID of the player' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Player.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number chosen by player (1–9)', nullable: true }),
    (0, mongoose_1.Prop)({ type: Number, required: false, default: null }),
    __metadata("design:type", Object)
], Player.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'session-abc-123', description: 'Associated session ID' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Player.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Whether the player is soft-deleted' }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Player.prototype, "deleted", void 0);
exports.Player = Player = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Player);
exports.PlayerSchema = mongoose_1.SchemaFactory.createForClass(Player);
//# sourceMappingURL=player.schema.js.map