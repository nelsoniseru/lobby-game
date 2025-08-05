import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRepository } from './ports/user.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserMongoRepository implements UserRepository {
  private readonly logger = new Logger(UserMongoRepository.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Finding user by username: ${username}`);
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: Partial<User>): Promise<User> {
    this.logger.log(`Creating user: ${user.username}`);
    return this.userModel.create(user);
  }

  async incrementWins(userId: string): Promise<void> {
    this.logger.log(`Incrementing wins for user: ${userId}`);
    await this.userModel.updateOne({ _id: userId }, { $inc: { wins: 1 } }).exec();
  }

  async incrementloses(userId: string): Promise<void> {
    this.logger.log(`Incrementing loses for user: ${userId}`);
    await this.userModel.updateOne({ _id: userId }, { $inc: { loses: 1 } }).exec();
  }
    async find(id: string): Promise<User| null> {
    return this.userModel.findById(id).exec();
  }
     async findByIds(ids: string[]): Promise<User[]> {
    this.logger.log(`Finding users by IDs: ${ids.join(', ')}`);
    return this.userModel.find({ _id: { $in: ids } }).select('username wins loses').lean().exec();
  }
    async findById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    return this.userModel.findById(id).select('username wins losses').exec();
  }
}