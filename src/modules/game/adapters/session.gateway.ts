import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from '../domain/game.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'game',
})
export class SessionGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameService: GameService) { }
  private readonly logger = new Logger(SessionGateway.name);

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  emitSessionCountdown(seconds: number) {
    this.logger.log(`Emitting session countdown: ${seconds} seconds`);
    this.server.emit('sessionCountdown', { seconds });
  }

  emitDelayCountdown(seconds: number) {
    this.logger.log(`Emitting delay countdown: ${seconds} seconds`);
    this.server.emit('delayCountdown', { seconds });
  }

  emitNewSession(sessionId: string) {
    this.logger.log(`Emitting new session: ${sessionId}`);
    this.server.emit('newSession', { sessionId });
  }

  emitSessionEnd(sessionId: string, winningNumber: number) {
    this.logger.log(`Emitting session end: ${sessionId}`);
    this.server.emit('sessionEnd', { sessionId, winningNumber });
  }
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() data: { sessionId: string; id: string }) {
    this.logger.log(`Client ${data.id} requested to join session ${data.sessionId} `);
    try {
      const user = await this.gameService.joinSession(data.sessionId, data.id);
      this.server.emit('joinSuccess', { user });
    } catch (error) {
      this.logger.error(`JoinRoom error: ${error.message}`);
      this.server.to(data.sessionId).emit('joinError', { message: error.message });
    }
  }
  @SubscribeMessage('playerCount')
  async broadcastPlayerCount(@MessageBody() data: { sessionId: string }) {
    const { sessionId } = data;
    try {
      const count = await this.gameService.getPlayerCount(sessionId);
      this.server.emit('playerSuccess', { sessionId, count });
    } catch (error) {
      this.server.to(sessionId).emit('playerError', { message: error.message });
    }
  }
  @SubscribeMessage('getSessionData')
  async handleGetSessionData(@MessageBody() data: { sessionId: string; userId: string }) {
    const { sessionId, userId } = data;
    try {
      const activeUsers = await this.gameService.getActiveUsers(sessionId);
      const winners = await this.gameService.getWinners(sessionId);
      const playerCount = await this.gameService.getPlayerCount(sessionId);
      const winCount = await this.gameService.getWinCount(sessionId);

      this.server.emit('sessionSuccess', {
        sessionId,
        activeUsers,
        winners,
        playerCount,
        winCount
      });
    } catch (error) {
      this.logger.error(`GetSessionData error: ${error.message}`);
      this.server.to(sessionId).emit('sessionError', { message: error.message });
    }
  }

  @SubscribeMessage('getUserData')
  async handleUserData(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    try {
      const totalWins = await this.gameService.getUserTotalWins(userId);
      const totalLosses = await this.gameService.getUserTotalLosses(userId);

      client.emit('userSuccess', {
        totalWins,
        totalLosses,
      });
    } catch (error) {
      this.logger.error(`userData error: ${error.message}`);

      client.emit('userError', { message: error.message });
    }
  }

}