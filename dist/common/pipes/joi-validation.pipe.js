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
var JoiValidationPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const Joi = __importStar(require("joi"));
const response_format_1 = require("../responses/response.format");
let JoiValidationPipe = JoiValidationPipe_1 = class JoiValidationPipe {
    schema;
    logger = new common_2.Logger(JoiValidationPipe_1.name);
    constructor(schema) {
        this.schema = schema;
    }
    transform(value) {
        const { error } = this.schema.validate(value);
        if (error) {
            this.logger.warn(`Validation failed: ${error.message}`);
            console.log(error.message);
            throw new common_1.BadRequestException(response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message));
        }
        this.logger.log('Validation passed');
        return value;
    }
};
exports.JoiValidationPipe = JoiValidationPipe;
exports.JoiValidationPipe = JoiValidationPipe = JoiValidationPipe_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], JoiValidationPipe);
//# sourceMappingURL=joi-validation.pipe.js.map