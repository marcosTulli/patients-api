import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class DeleteManyPatientsDto {
  @IsArray({ message: 'IDs must be an array' })
  @ArrayNotEmpty({ message: 'IDs array cannot be empty' })
  @IsMongoId({ each: true, message: 'Each ID must be a valid MongoDB ID' })
  ids: string[];
}
