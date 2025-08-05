import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context) {
    this.logger.log('Validating JWT token');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn(`JWT validation failed: ${info?.message || err?.message || 'No user found'}`);
      throw err || new UnauthorizedException('Unauthorized');
    }
    this.logger.log(`JWT validated successfully for user: ${user.username}`);
    return user;
  }
}