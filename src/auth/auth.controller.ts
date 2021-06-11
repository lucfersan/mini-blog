import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthDTO } from './auth-DTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async authenticate(
    @Body() { email, password }: AuthDTO,
    @Res() response: Response,
  ): Promise<Response> {
    const { user, token } = await this.authService.authenticate({
      email,
      password,
    });

    return response.json({
      user,
      token,
    });
  }
}
