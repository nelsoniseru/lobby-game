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
exports.SubmitNumberResponse = exports.SubmitNumberDto = exports.SubmitNumberDtoSchema = void 0;
const Joi = __importStar(require("joi"));
const swagger_1 = require("@nestjs/swagger");
exports.SubmitNumberDtoSchema = Joi.object({
    sessionId: Joi.string().required(),
    userId: Joi.string().required(),
    number: Joi.number().integer().min(1).max(9).required()
});
class SubmitNumberDto {
    sessionId;
    userId;
    number;
}
exports.SubmitNumberDto = SubmitNumberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123-session-id', description: 'ID of the active game session' }),
    __metadata("design:type", String)
], SubmitNumberDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123-session-id', description: 'ID of the user' }),
    __metadata("design:type", String)
], SubmitNumberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number picked by the player (1-9)', minimum: 1, maximum: 9 }),
    __metadata("design:type", Number)
], SubmitNumberDto.prototype, "number", void 0);
class SubmitNumberResponse {
    message;
}
exports.SubmitNumberResponse = SubmitNumberResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Number chosen for session.', description: 'Response message after submission' }),
    __metadata("design:type", String)
], SubmitNumberResponse.prototype, "message", void 0);
//# sourceMappingURL=submitNumber.dto.js.map