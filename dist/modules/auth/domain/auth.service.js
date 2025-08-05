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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_helper_1 = require("../../../common/helpers/auth.helper");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const user = await this.userRepository.findByUsername(dto.username);
        if (user) {
            throw new common_1.HttpException('Username already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashed = await (0, auth_helper_1.hashPassword)(dto.password);
        const newUser = await this.userRepository.create({
            username: dto.username,
            password: hashed,
        });
        const token = (0, auth_helper_1.generateToken)(this.jwtService, {
            id: newUser.id,
            username: newUser.username,
        });
        return { token };
    }
    async login(dto) {
        console.log(dto);
        const user = await this.userRepository.findByUsername(dto.username);
        if (!user) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const isValid = await (0, auth_helper_1.comparePassword)(dto.password, user.password);
        if (!isValid) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = (0, auth_helper_1.generateToken)(this.jwtService, {
            id: user.id,
            username: user.username,
        });
        return { token };
    }
    async me(id) {
        const user = await this.userRepository.find(id);
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map