import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`AdminGuard: Checking user access - User: ${JSON.stringify(user)}`);

    if (!user) {
      this.logger.warn('AdminGuard: No user found in request');
      return false;
    }

    if (user.role !== 'admin') {
      this.logger.warn(`AdminGuard: User ${user.email} with role '${user.role}' denied access`);
      return false;
    }

    this.logger.debug(`AdminGuard: User ${user.email} granted admin access`);
    return true;
  }
}