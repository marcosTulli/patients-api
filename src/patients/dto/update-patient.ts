import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'First name must not be empty' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name must not be empty' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

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
