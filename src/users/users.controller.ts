import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
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

  @Put()
  async update(
    @Body() { name, email, password }: CreateUserDTO,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { id } = request.user;

    const user = await this.userService.updateUser({
      id,
      name,
      email,
      password,
    });

    return response.json(user);
  }

  @Delete()
  async delete(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { id } = request.user;

    await this.userService.deleteUser({ id });
    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
