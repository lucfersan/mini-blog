import { Prisma, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

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

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const {
      where: { id },
      data: { name, email, password },
    } = params;

    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
      },
    });

    return updatedUser;
  }

  async deleteUser({ id }: Prisma.UserWhereUniqueInput): Promise<void> {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
