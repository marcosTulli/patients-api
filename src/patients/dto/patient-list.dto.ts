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

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  take: number;
}

export class PatientFilterDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dobFrom?: string;

  @IsOptional()
  @IsDateString()
  dobTo?: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class PatientSortDto {
  @IsOptional()
  @IsString()
  @IsIn(['firstName', 'lastName', 'email', 'phoneNumber', 'dob', '_id'])
  field?: string;

  @IsOptional()
  @IsEnum(SortDirection)
  direction?: SortDirection;
}

export class PatientListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientFilterDto)
  filter?: PatientFilterDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientSortDto)
  sort?: PatientSortDto | null;
}
