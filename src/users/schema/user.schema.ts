import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export enum Roles {
  Admin = 'admin',
  User = 'user',
}

export type UserDocument = User & Document & { _id: Types.ObjectId };
export interface RequestWithUser extends Request {
  user: User;
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Roles,
    example: Roles.User,
    description: 'Role of the user',
  })
  @IsEnum(Roles)
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
