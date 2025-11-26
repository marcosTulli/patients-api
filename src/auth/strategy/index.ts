import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';

import { User, UserDocument } from '../../users/schema/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
          return authHeader.slice(7);
        }
        return null;
      },
      secretOrKey: config.get<string>('JWT_SECRET') ?? '',
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    return await this.userModel.findById(payload.sub, { password: 0 }).lean();
  }
}
