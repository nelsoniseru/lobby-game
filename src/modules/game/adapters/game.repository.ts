import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSession, GameRepository } from '../ports/game.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class GameMongoRepository implements GameRepository {
  private readonly logger = new Logger(GameMongoRepository.name);

  constructor(@InjectModel('GameSession') private readonly gameModel: Model<GameSession>) {}

  async create(session: Partial<GameSession>): Promise<GameSession> {
    this.logger.log(`Creating game session: ${session.sessionId}`);
    console.log(session)
    return this.gameModel.create(session);
  }

  async findById(sessionId: string): Promise<GameSession | null> {
    this.logger.log(`Finding game session by ID: ${sessionId}`);
    return this.gameModel.findOne({ sessionId }).exec();
  }

async update(sessionId: string, updateFields: Partial<GameSession>): Promise<GameSession | null> {
  this.logger.log(`Updating game session: ${sessionId}`);
  const updatedSession = await this.gameModel
    .findOneAndUpdate({ sessionId }, updateFields, { new: true })
    .exec();

  if (!updatedSession) {
    this.logger.warn(`Session not found for update: ${sessionId}`);
    throw new Error(`Session ${sessionId} not found`);
  }

  return updatedSession;
}


  async findActiveSession(): Promise<GameSession | null> {
    this.logger.log(`Finding active session`);
    return this.gameModel.findOne({ status: 'active' }).exec();
  }

async getTopPlayers(limit: number, filter: string = 'all'): Promise<any[]> {
  this.logger.log(`Fetching top ${limit} players with filter: ${filter}`);

  const now = new Date();
  const matchStage: any = { status: 'ended' }; 

  if (filter === 'day') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    matchStage.createdAt = {
      $gte: new Date(startOfDay.getTime() - 1 * 60 * 60 * 1000),
      $lte: new Date(startOfDay.getTime() + (23 * 60 + 59) * 60 * 1000 + 999 - 1 * 60 * 60 * 1000)
    };
  } else if (filter === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    matchStage.createdAt = { $gte: new Date(weekAgo.getTime() - 1 * 60 * 60 * 1000) };
  } else if (filter === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    matchStage.createdAt = {
      $gte: new Date(startOfMonth.getTime() - 1 * 60 * 60 * 1000),
      $lte: new Date(endOfMonth.getTime() - 1 * 60 * 60 * 1000)
    };
  }

  return this.gameModel.aggregate([
    { $match: matchStage }, 

    { $unwind: '$players' }, 

    {
      $match: {
        $expr: { $eq: ['$players.number', '$winningNumber'] }
      }
    },

    {
      $group: {
        _id: '$players.userId',
        wins: { $sum: 1 },
        lastWinDate: { $max: '$createdAt' }
      }
    },

    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },

    { $unwind: '$user' },

    { $sort: { wins: -1 } },

    { $limit: limit },

    {
      $project: {
        name: '$user.username',
        wins: 1,
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$lastWinDate'
          }
        }
      }
    }
  ]).exec();
}


  async getSessionsByDate(): Promise<any[]> {
    this.logger.log('Fetching sessions grouped by date');
    return this.gameModel
      .aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, sessions: { $push: '$$ROOT' } } },
      ])
      .exec();
  }
 
}