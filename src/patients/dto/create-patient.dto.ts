import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Phone number cannot be empty if provided' })
  phoneNumber?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO 8601 date string' },
  )
  dob?: string;
}
