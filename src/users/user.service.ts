import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { User, UserDocument } from './schema/user.schema';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: SignupDto): Promise<UserDocument> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userModel.findOne({ email: dto.email }).exec(),
      this.userModel.findOne({ username: dto.name }).exec(),
    ]);

    if (existingEmail) {
      throw new ForbiddenException('Email is already taken');
    }

    if (existingUsername) {
      throw new ForbiddenException('Username is already taken');
    }

    const hashedPassword = await argon.hash(dto.password);

    const newUser = new this.userModel({
      email: dto.email,
      username: dto.name,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
