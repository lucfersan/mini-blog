import { User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

type CreateRequest = {
  name: string;
  email: string;
  password: string;
};

type UpdateRequest = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type DeleteRequest = {
  id: string;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser({ name, email, password }: CreateRequest): Promise<User> {
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

  async updateUser({
    id,
    name,
    email,
    password,
  }: UpdateRequest): Promise<User> {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    if (userExists.email !== email) {
      const findUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (findUser) {
        throw new HttpException(
          'Email provided already registered.',
          HttpStatus.CONFLICT,
        );
      }
    }

    const hashedPassword = await hash(password, 8);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return updatedUser;
  }

  async deleteUser({ id }: DeleteRequest): Promise<void> {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
