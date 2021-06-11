import { Prisma, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({
    name,
    email,
    password,
  }: Prisma.UserCreateInput): Promise<User> {
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }
}
