import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoRepository } from './adapters/user.repository';
import { UserSchema } from '../auth/entity/user.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    { provide: 'UserRepository', useClass: UserMongoRepository },
  ],
  exports: ['UserRepository'], 
})
export class UserModule {}