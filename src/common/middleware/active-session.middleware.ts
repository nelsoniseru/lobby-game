// import { Inject, Injectable, NestMiddleware, HttpStatus, HttpException, ExecutionContext, CanActivate} from '@nestjs/common';import { Request, Response, NextFunction } from 'express';
// import type { GameRepository } from '../../modules/game/ports/game.repository'; // Fixed TS1272
// import { ResponseFormat } from '../responses/response.format';
// import { Logger } from '@nestjs/common'




// @Injectable()
// export class ActiveSessionGuard implements CanActivate {
//   private readonly logger = new Logger(ActiveSessionGuard.name);

//   constructor(
//     @Inject('GameRepository') private readonly gameRepository: GameRepository
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: Request = context.switchToHttp().getRequest();

//     if (!req.user) {
//       this.logger.error('No user found in request');
//       throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
//     }

//     const userId = req.user['id'];
//     this.logger.log(`Checking active session for user: ${userId}`);

//     const activeSession = await this.gameRepository.findActiveSessionByUserId(userId);

//     if (activeSession) {
//       this.logger.warn(`User ${userId} already in active session: ${activeSession.sessionId}`);
//       throw new HttpException('User already in an active session', HttpStatus.BAD_REQUEST);
//     }

//     this.logger.log(`No active session found for user: ${userId}`);
//     return true;
//   }
// }
