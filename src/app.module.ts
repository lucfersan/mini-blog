import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConfig } from './config/auth';
import { EnsureAuthenticatedMiddleware } from './middlewares/ensure-authenticated.middleware';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ secret: jwtConfig.secret }),
  ],
  controllers: [UsersController, AuthController, PostsController],
  providers: [PrismaService, UsersService, AuthService, PostsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EnsureAuthenticatedMiddleware).forRoutes(
      {
        path: 'users',
        method: RequestMethod.PUT,
      },
      {
        path: 'users',
        method: RequestMethod.DELETE,
      },
      'posts',
    );
  }
}
