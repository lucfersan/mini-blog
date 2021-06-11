import { User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { jwtConfig } from 'src/config/auth';
import { PrismaService } from 'src/prisma/prisma.service';

type Request = {
  email: string;
  password: string;
};

type Response = {
  user: User;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async authenticate({ email, password }: Request): Promise<Response> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.jwtService.signAsync(
      {},
      {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn,
        subject: user.id,
      },
    );

    return {
      user,
      token,
    };
  }
}
