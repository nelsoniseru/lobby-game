"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const game_controller_1 = require("./adapters/game.controller");
const game_service_1 = require("./domain/game.service");
const game_repository_1 = require("./adapters/game.repository");
const game_schema_1 = require("./entity/game.schema");
const user_modules_1 = require("../user/user.modules");
const player_module_1 = require("../player/player.module");
const session_scheduler_service_1 = require("../game/domain/session-scheduler.service");
const session_gateway_1 = require("./adapters/session.gateway");
const schedule_1 = require("@nestjs/schedule");
const player_schema_1 = require("../player/entity/player.schema");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'GameSession', schema: game_schema_1.GameSessionSchema },
                { name: 'Player', schema: player_schema_1.PlayerSchema },
            ]),
            config_1.ConfigModule,
            user_modules_1.UserModule,
            player_module_1.PlayerModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [game_controller_1.GameController],
        providers: [
            game_service_1.GameService,
            session_scheduler_service_1.SessionSchedulerService,
            session_gateway_1.SessionGateway,
            { provide: 'GameRepository', useClass: game_repository_1.GameMongoRepository },
        ],
    })
], GameModule);
//# sourceMappingURL=game.modules.js.map