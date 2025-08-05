import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../entity/player.schema';

@Injectable()
export class PlayerRepository {
  constructor(@InjectModel(Player.name) private readonly playerModel: Model<Player>) {}

  async findOne(filter: Record<string, any>) {
    return this.playerModel.findOne(filter).exec();
  }

  async count(filter: Record<string, any>) {
    return this.playerModel.countDocuments(filter).exec();
  }

  async create(data: Partial<Player>) {
    return this.playerModel.create(data);
  }

  async softDelete(filter: Record<string, any>) {
  return this.playerModel.updateOne(filter, { deleted: true }).exec();
}
async update(filter: Record<string, any>, updateData: Partial<Player>) {
  return this.playerModel.updateOne(filter, { $set: updateData }).exec();
}
 async find(filter: Record<string, any>): Promise<Player[]> {
    return this.playerModel.find(filter).exec();
  }
 async findsession(sessionId:string): Promise<Player[]> {
    return this.playerModel.find({sessionId:sessionId}).exec();
  }

}
