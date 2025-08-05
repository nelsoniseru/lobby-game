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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.StandardResponse = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../domain/auth.service");
const auth_dto_1 = require("../../../common/dto/auth.dto");
const joi_validation_pipe_1 = require("../../../common/pipes/joi-validation.pipe");
const response_format_1 = require("../../../common/responses/response.format");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
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
let AuthController = AuthController_1 = class AuthController {
    authService;
    logger = new common_2.Logger(AuthController_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        this.logger.log(`Received register request for username: ${dto.username}`);
        try {
            const result = await this.authService.register(dto);
            this.logger.log(`Registration successful for username: ${dto.username}`);
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.CREATED, { token: result.token }, 'Registration successful');
        }
        catch (error) {
            this.logger.error(`Registration failed: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.BAD_REQUEST, error.message);
        }
    }
    async login(dto) {
        this.logger.log(`Received login request for username: ${dto.username}`);
        try {
            const result = await this.authService.login(dto);
            this.logger.log(`Login successful for username: ${dto.username}`);
            return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { token: result.token }, 'Login successful');
        }
        catch (error) {
            this.logger.error(`Login failed: ${error.message}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.UNAUTHORIZED, error.message);
        }
    }
    async getUserDetails(req) {
        const userId = req.user.id;
        const user = await this.authService.me(userId);
        if (!user) {
            this.logger.error(`User not found: ${userId}`);
            return response_format_1.ResponseFormat.error(common_1.HttpStatus.NOT_FOUND, 'User not found');
        }
        this.logger.log(`User details retrieved for user: ${userId}`);
        return response_format_1.ResponseFormat.success(common_1.HttpStatus.OK, { user }, 'User details retrieved');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input', type: (StandardResponse) }),
    __param(0, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(auth_dto_1.RegisterDtoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login a user and return a JWT token' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials', type: (StandardResponse) }),
    __param(0, (0, common_1.Body)(new joi_validation_pipe_1.JoiValidationPipe(auth_dto_1.LoginDtoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get currently authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user details', type: (StandardResponse) }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: (StandardResponse) }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserDetails", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map