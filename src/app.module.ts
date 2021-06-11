import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
