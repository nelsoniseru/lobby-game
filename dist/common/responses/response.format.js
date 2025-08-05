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
exports.ResponseFormat = void 0;
const swagger_1 = require("@nestjs/swagger");
class ResponseFormat {
    status;
    data;
    static success(statusCode, data) {
        return { status: true, data: { data } };
    }
    static error(statusCode, message, data = null) {
        return { status: false, data: { message, data } };
    }
}
exports.ResponseFormat = ResponseFormat;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Request status' }),
    __metadata("design:type", Boolean)
], ResponseFormat.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response data, including optional message and data payload' }),
    __metadata("design:type", Object)
], ResponseFormat.prototype, "data", void 0);
//# sourceMappingURL=response.format.js.map