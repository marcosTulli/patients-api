import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Document } from 'mongoose';

export class Patient extends Document {
  @ApiProperty({ example: 'John', description: 'First name of the patient' })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the patient' })
  @IsString()
  @Prop({ required: true })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email of the patient',
  })
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the patient',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: '1980-12-31',
    description: 'Date of birth of the patient',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
