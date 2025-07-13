import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto';
import { UserService } from '@users/user.service';
import { Roles } from '@users/schema/user.schema';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup({ dto }: { dto: SignupDto }) {
    const user = await this.userService.createUser(dto);

    return this.signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  async login({ dto }: { dto: LoginDto }) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  private async signToken({
    userId,
    email,
    role,
  }: {
    userId: string;
    email: string;
    role?: Roles;
  }): Promise<{ access_token: string }> {
    const payload: Record<string, string | Roles> = { sub: userId, email };
    if (role) {
      payload.role = role;
    }

    const secret = this.config.get<string>('JWT_SECRET') ?? '';
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
