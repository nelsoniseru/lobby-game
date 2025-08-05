import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common'; import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import type { GameRepository } from '../ports/game.repository';
import type { UserRepository } from '../../user/adapters/ports/user.repository';
import type { PlayerRepository } from '../../player/adapters/ports/player.repository';
import { Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { console } from 'inspector';
import { Player } from '../../player/entity/player.schema';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private queue: string[] = [];

  constructor(
    @Inject('GameRepository') private readonly gameRepository: GameRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PlayerRepository') private readonly  playerRepository: PlayerRepository,
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {
    this.validateConfig();
  }

  private validateConfig() {
    const sessionDuration = this.configService.get<number>('SESSION_DURATION_SECONDS');
    const sessionUserCap = this.configService.get<number>('SESSION_USER_CAP');

    if (sessionDuration === undefined) {
      this.logger.error('SESSION_DURATION_SECONDS is not defined in configuration');
      throw new Error('Missing configuration: SESSION_DURATION_SECONDS');
    }
    if (sessionUserCap === undefined) {
      this.logger.error('SESSION_USER_CAP is not defined in configuration');
      throw new Error('Missing configuration: SESSION_USER_CAP');
    }
  }

  async startSession() {
    this.logger.log(`Starting new session for user`);
    const sessionDuration = this.configService.get<number>('SESSION_DURATION_SECONDS')!;

    const session = await this.gameRepository.create({
      sessionId: uuidv4(),
      status: 'active',
      startTime: new Date(),
      duration: sessionDuration * 1000,
      winningNumber:Math.floor(Math.random() * 9) + 1,
    });
    console.log(session)
    this.logger.log(`Session started: ${session.sessionId}`);
    return session;
  }

  async joinSession(sessionId: string, id: string): Promise<Player> {
    this.logger.log(`User ${id} attempting to join session: ${sessionId}`);
    const session = await this.gameRepository.findById(sessionId);
    if (!session || session.status !== 'active') {
      this.logger.warn(`Session not active: ${sessionId}`);
      throw new HttpException('Session not active', HttpStatus.BAD_REQUEST);
    }

    const sessionUserCap = this.configService.get<number>('SESSION_USER_CAP')!;
    const playerCount = await this.playerRepository.count({ sessionId });

    if (playerCount >= sessionUserCap) {
      this.queue.push(id);
      this.logger.log(`Session full, user ${id} added to queue`);
      throw new HttpException('Session full, added to queue', HttpStatus.OK);
    }

    const existingPlayer = await this.playerRepository.findOne({ id, sessionId });
    if (existingPlayer) {
      this.logger.warn(`User ${id} already in session: ${sessionId}`);
      throw new HttpException('User already in session', HttpStatus.BAD_REQUEST);
    }

    const newPlayer = await this.playerRepository.create({
      userId: id,
      sessionId,
    });

    this.logger.log(`User ${id} joined session: ${sessionId}`);
    return newPlayer;
  }

  async leaveSession(sessionId: string, userId: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to leave session: ${sessionId}`);

    const session = await this.gameRepository.findById(sessionId);
    if (!session || session.status !== 'active') {
      this.logger.warn(`Session not active: ${sessionId}`);
      throw new HttpException('Session not active', HttpStatus.BAD_REQUEST);
    }

    const result = await this.playerRepository.softDelete({ sessionId, userId });

    this.logger.log(`User ${userId} removed from session: ${sessionId}`);

    const sessionUserCap = this.configService.get<number>('SESSION_USER_CAP')!;
    const currentCount = await this.playerRepository.count({ sessionId });

    if (this.queue.length > 0 && currentCount < sessionUserCap) {
      const nextUserId = this.queue.shift();
      this.logger.log(`Adding queued user ${nextUserId} to session: ${sessionId}`);

      await this.playerRepository.create({
        userId: nextUserId!,
        number: null,
        sessionId,
        deleted: false,
      });

      this.logger.log(`Queued user ${nextUserId} joined session: ${sessionId}`);
    }
  }


  async getPlayerCount(sessionId: string): Promise<number> {
    const count = await this.playerRepository.count({ sessionId });
    return count;
  }

  async getTopPlayers(limit: number, filter: string) {
    this.logger.log(`Fetching top ${limit} players`);
    return this.gameRepository.getTopPlayers(limit);
  }

  async getSessionsByDate() {
    this.logger.log('Fetching sessions grouped by date');
    return this.gameRepository.getSessionsByDate();
  }

  async submitPlayerNumber(sessionId: string, userId: string, number: number): Promise<{ message: string }> {
    this.logger.log(`Submitting number ${number} for user ${userId} in session ${sessionId}`);

    // Validate session
    const session = await this.gameRepository.findById(sessionId);
    if (!session || session.status !== 'active') {
      this.logger.warn(`Cannot submit number — session not active or not found: ${sessionId}`);
      throw new HttpException('Session not active', HttpStatus.BAD_REQUEST);
    }

    // Check that user is part of session
    const player = await this.playerRepository.findOne({ userId, sessionId });
    if (!player) {
      this.logger.warn(`User ${userId} not found in session ${sessionId}`);
      throw new HttpException('User not in session', HttpStatus.NOT_FOUND);
    }

    // Prevent duplicate submissions
    if (player.number !== undefined && player.number !== null) {
      this.logger.warn(`User ${userId} already submitted a number`);
      throw new HttpException('Number already submitted', HttpStatus.BAD_REQUEST);
    }

    // Update the player record with their number
    await this.playerRepository.update({ userId, sessionId }, { number });
    this.logger.log(`Number ${number} submitted successfully for user ${userId} in session ${sessionId}`);

    // 🔍 Compare with winning number
    const winningNumber = session.winningNumber;
    if (winningNumber === undefined || winningNumber === null) {
      this.logger.warn(`Winning number not yet defined for session ${sessionId}`);
    } else if (number === winningNumber) {
      await this.userRepository.incrementWins(userId);
      this.logger.log(`User ${userId} guessed correctly! Winning number: ${winningNumber}`);
    } else {
      await this.userRepository.incrementloses(userId);
      this.logger.log(`User ${userId} guessed ${number}, but winning number was ${winningNumber}`);
    }

    return {
      message: 'Number accepted for session.'
    };
  }


  async getActiveUsers(sessionId: string): Promise<string[]> {
    this.logger.log(`Fetching active users for session: ${sessionId}`);
    const players = await this.playerRepository.find({ sessionId, deleted: false });
    const userIds = players.map((player) => player.userId);
    const users = await this.userRepository.findByIds(userIds);
    return users.map((user) => user.username);
  }

  async getWinners(sessionId: string): Promise<string[]> {
    this.logger.log(`Fetching winners for session: ${sessionId}`);
    console.log(sessionId)
    const session = await this.gameRepository.findById(sessionId);
    if (!session) {
      this.logger.warn(`Session not ended or not found: ${sessionId}`);
      return [];
    }
    const players = await this.playerRepository.find({
      sessionId,
      number: session.winningNumber,
    });
    const userIds = players.map((player) => player.userId);
    const users = await this.userRepository.findByIds(userIds);
    console.log(users)
    return users.map((user) => user.username);
  }

  async getWinCount(sessionId: string): Promise<number> {
    this.logger.log(`Fetching win count for session: ${sessionId}`);
    console.log(sessionId)
    const session = await this.gameRepository.findById(sessionId);
    if (!session) {
      this.logger.warn(`Session not ended or not found: ${sessionId}`);
      return 0;
    }
    return this.playerRepository.count({
      sessionId,
      number: session.winningNumber,
    });
  }

  async getUserTotalWins(userId: string): Promise<number> {
    this.logger.log(`Fetching total wins for user: ${userId}`);
    const user = await this.userRepository.find(userId);
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.wins || 0;
  }

  async getUserTotalLosses(userId: string): Promise<number> {
    this.logger.log(`Fetching total losses for user: ${userId}`);
    const user = await this.userRepository.find(userId);
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.loses || 0;
  }
}