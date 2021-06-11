import { User } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './create-user-DTO';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @Post()
  async create(
    @Body() { name, email, password }: CreateUserDTO,
  ): Promise<User> {
    const user = await this.userService.createUser({
      name,
      email,
      password,
    });

    delete user.password;

    return user;
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() { name, email, password }: CreateUserDTO,
  ): Promise<User> {
    const user = await this.userService.updateUser({
      where: { id },
      data: { name, email, password },
    });

    return user;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser({ id });
  }
}
