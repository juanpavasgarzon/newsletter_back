import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { LoginResult } from '../contracts';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  run(secret: string): LoginResult {
    const adminSecret = this.config.get<string>('auth.adminSecret');
    if (secret !== adminSecret) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const expiresInSeconds = this.config.get<number>('auth.jwtExpiresInSeconds');
    const payload = { sub: 'admin' };
    const token = this.jwtService.sign(payload, {
      expiresIn: expiresInSeconds,
    });
    const expiresAt = new Date(Date.now() + (expiresInSeconds ?? 0) * 1000).toISOString();
    return {
      token,
      expiresAt,
    };
  }
}
