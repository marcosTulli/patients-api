import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

@Schema()
export class Patient {
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
  @Prop()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: '1980-12-31',
    description: 'Date of birth of the patient',
    required: false,
  })
  @Prop()
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when the patient record was created',
  })
  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export type PatientDocument = Patient & Document;
export const PatientSchema = SchemaFactory.createForClass(Patient);
