import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GameController } from './adapters/game.controller';
import { GameService } from './domain/game.service';
import { GameMongoRepository } from './adapters/game.repository';
import { GameSessionSchema } from './entity/game.schema';
import { UserModule } from '../user/user.modules';
import { PlayerModule } from '../player/player.module';
import { SessionSchedulerService } from '../game/domain/session-scheduler.service';
import { SessionGateway } from './adapters/session.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerSchema } from '../player/entity/player.schema'; 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GameSession', schema: GameSessionSchema },
      { name: 'Player', schema: PlayerSchema },

    ]),
    ConfigModule,
    UserModule,
    PlayerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    SessionSchedulerService,
    SessionGateway,
    { provide: 'GameRepository', useClass: GameMongoRepository },
    ],
})
export class GameModule {}







