import { User } from '.prisma/client';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user-DTO';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
}
