import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 'Jane',
    description: 'First name of the patient',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the patient',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'jane.doe@example.com',
    description: 'Email address of the patient',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number of the patient',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Phone number cannot be empty if provided' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: '1980-01-01',
    description: 'Date of birth of the patient (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO 8601 date string' },
  )
  dob?: string;
}
