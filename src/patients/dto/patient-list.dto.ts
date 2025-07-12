import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Page number, starting at 1',
  })
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of items to take per page, max 50',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  take: number;
}

export class PatientFilterDto {
  @ApiPropertyOptional({ example: 'John', description: 'Filter by first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Filter by last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Filter by email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Filter by phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: '1980-01-01',
    description: 'Filter by date of birth (start)',
  })
  @IsOptional()
  @IsDateString()
  dobFrom?: string;

  @ApiPropertyOptional({
    example: '1990-12-31',
    description: 'Filter by date of birth (end)',
  })
  @IsOptional()
  @IsDateString()
  dobTo?: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PatientSortDto {
  @ApiPropertyOptional({
    example: 'firstName',
    description: 'Field to sort by',
    enum: ['firstName', 'lastName', 'email', 'phoneNumber', 'dob', '_id'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['firstName', 'lastName', 'email', 'phoneNumber', 'dob', '_id'])
  field?: string;

  @ApiPropertyOptional({
    example: SortDirection.ASC,
    enum: SortDirection,
    description: 'Sort direction',
  })
  @IsOptional()
  @IsEnum(SortDirection)
  direction?: SortDirection;
}

export class PatientListDto {
  @ApiProperty({
    type: () => PaginationDto,
    description: 'Pagination options',
  })
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @ApiPropertyOptional({
    type: () => PatientFilterDto,
    description: 'Filter criteria',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientFilterDto)
  filter?: PatientFilterDto | null;

  @ApiPropertyOptional({
    type: () => PatientSortDto,
    description: 'Sort options',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientSortDto)
  sort?: PatientSortDto | null;
}
