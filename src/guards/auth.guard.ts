import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Role } from '../auth/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  // Injecting necessary services: JwtService for token verification, ConfigService for retrieving JWT secret
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const classRoles = this.reflector.get<Role[]>('roles', context.getClass());
    const methodRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    const overrideRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const mergeRoles = this.reflector.getAllAndMerge<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Class Roles:', classRoles);
    console.log('Method Roles:', methodRoles);
    console.log('Override Roles:', overrideRoles);
    console.log('Merged Roles:', mergeRoles);

    // Retrieving the request object from the execution context
    const request: Request = context.switchToHttp().getRequest();
    // Extracting the authorization header which contains the JWT token
    const { authorization } = request.headers;
    // Extracting token from the authorization header
    const token = authorization.split(' ')[1];

    try {
      // Verifying the token using the JWT secret
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      // Assigning the user payload to the 'user' property of the request object
      request['user'] = payload;
    } catch (error) {
      // If token verification fails throw an UnauthorizedException
      throw new UnauthorizedException();
    }
    // If token verification is successful, return true to grant access
    return true;
  }
}
