import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto';
import { Roles, User, UserDocument } from '@users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup({ dto }: { dto: SignupDto }) {
    const hash = await argon.hash(dto.password);

    const existingUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();
    if (existingUser) {
      throw new ForbiddenException('Credentials taken');
    }

    const createdUser = new this.userModel({
      email: dto.email,
      name: dto.name,
      password: hash,
    });
    await createdUser.save();

    return this.signToken({
      userId: createdUser._id.toString(),
      email: createdUser.email,
    });
  }

  async login({ dto }: { dto: LoginDto }) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = user.password
      ? await argon.verify(user.password, dto.password)
      : false;
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  async signToken({
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

    const secret: string = this.config.get('JWT_SECRET') ?? '';
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return { access_token: token };
  }
}
