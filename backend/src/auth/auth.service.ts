import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ApiError } from '../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    const valid = admin
      ? await compare(dto.password, admin.passwordHash)
      : false;

    if (!admin || !valid) {
      throw new ApiError(
        'INVALID_CREDENTIALS',
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN', '1h');
    const accessToken = await this.jwt.signAsync(
      { sub: admin.id, email: admin.email, role: 'admin' },
      { expiresIn: expiresIn as never, algorithm: 'HS256' },
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      admin: { id: admin.id, email: admin.email },
    };
  }
}
