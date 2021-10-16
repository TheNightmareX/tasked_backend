import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { IncomingHttpHeaders } from 'node:http';
import { User } from 'src/users/entities/user.entity';

import { UsersService } from '../users/users.service';
import { AuthResult } from './dto/auth-result.dto';

@Injectable()
export class AuthService {
  @Inject()
  private users: UsersService;

  @Inject()
  private jwt: JwtService;

  async obtainJwt(username: string, password: string): Promise<AuthResult> {
    try {
      const user = await this.users.retrieve({ username });
      const isValid = await bcryptjs.compare(password, user.password);
      if (isValid) {
        const token = await this.signJwt(user);
        return { token, user };
      }
    } catch (error) {
      if (error instanceof NotFoundException) return;
      throw error;
    }
  }

  async verifyJwt(token: string) {
    try {
      const { id } = await this.jwt.verifyAsync<JwtData>(token);
      return this.users.retrieve(id);
    } catch (error) {
      return;
    }
  }

  getJwtFromHeaders(headers: IncomingHttpHeaders): string | undefined {
    return headers.authorization?.slice(7); // `7` is the length of the prefix "Bearer "
  }

  private async signJwt(user: User) {
    const { id, username } = user;
    const data: JwtData = { id, username };
    return this.jwt.signAsync(data);
  }
}

interface JwtData {
  id: number;
  username: string;
}
