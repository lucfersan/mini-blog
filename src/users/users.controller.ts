import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from './create-user-DTO';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<Response> {
    const users = await this.userService.findAll();
    return response.json(users);
  }

  @Post()
  async create(
    @Body() { name, email, password }: CreateUserDTO,
    @Res() response: Response,
  ): Promise<Response> {
    const user = await this.userService.createUser({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() { name, email, password }: CreateUserDTO,
    @Res() response: Response,
  ): Promise<Response> {
    const user = await this.userService.updateUser({
      where: { id },
      data: { name, email, password },
    });

    return response.json(user);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    await this.userService.deleteUser({ id });
    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
