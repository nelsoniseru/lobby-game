import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerMongoRepository} from './adapters/player.repository';
import { PlayerSchema } from '../player/entity/player.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  providers: [
    { provide: 'PlayerRepository', useClass: PlayerMongoRepository },
  ],
  exports: ['PlayerRepository'], 
})
export class PlayerModule {}