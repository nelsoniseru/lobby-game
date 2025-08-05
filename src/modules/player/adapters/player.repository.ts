import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../entity/player.schema';
import { PlayerRepository } from '../adapters/ports/player.repository';

@Injectable()
export class PlayerMongoRepository implements PlayerRepository {
  private readonly logger = new Logger(PlayerMongoRepository.name);

  constructor(@InjectModel(Player.name) private readonly playerModel: Model<Player>) {}

  async findOne(filter: Record<string, any>): Promise<Player | null> {
    this.logger.log(`Finding player with filter: ${JSON.stringify(filter)}`);
    return this.playerModel.findOne(filter).exec();
  }

  async findById(id: string): Promise<Player | null> {
    this.logger.log(`Finding player by ID: ${id}`);
    return this.playerModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Player[]> {
    this.logger.log(`Finding players by IDs: ${ids.join(', ')}`);
    return this.playerModel.find({ _id: { $in: ids } }).exec();
  }

  async find(filter: Record<string, any>): Promise<Player[]> {
    this.logger.log(`Finding players with filter: ${JSON.stringify(filter)}`);
    return this.playerModel.find(filter).exec();
  }

  async findSession(sessionId: string): Promise<Player[]> {
    this.logger.log(`Finding players in session: ${sessionId}`);
    return this.playerModel.find({ sessionId }).exec();
  }

  async count(filter: Record<string, any>): Promise<number> {
    this.logger.log(`Counting players with filter: ${JSON.stringify(filter)}`);
    return this.playerModel.countDocuments(filter).exec();
  }

  async create(data: Partial<Player>): Promise<Player> {
    this.logger.log(`Creating player`);
    return this.playerModel.create(data as any);
  }

  async update(filter: Record<string, any>, updateData: Partial<Player>): Promise<void> {
    this.logger.log(`Updating player with filter: ${JSON.stringify(filter)}`);
    await this.playerModel.updateOne(filter, { $set: updateData }).exec();
  }

  async softDelete(filter: Record<string, any>): Promise<void> {
    this.logger.log(`Soft deleting player with filter: ${JSON.stringify(filter)}`);
    await this.playerModel.updateOne(filter, { deleted: true }).exec();
  }
}
