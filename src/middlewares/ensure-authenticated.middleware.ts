import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';
import { jwtConfig } from 'src/config/auth';

type TokenPayload = {
  iat: number;
  exp: number;
  sub: string;
};

@Injectable()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpException('No token provided.', HttpStatus.UNAUTHORIZED);
    }

    // Bearer token
    const [, token] = authHeader.split(' ');

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret,
      });

      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      };

      return next();
    } catch {
      throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
    }
  }
}
