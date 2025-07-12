import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteManyPatientsDto {
  @ApiProperty({
    example: ['60d21b4667d0d8992e610c85', '60d21b4967d0d8992e610c86'],
    description: 'Array of MongoDB ObjectIds for patients to delete',
    type: [String],
  })
  @IsArray({ message: 'IDs must be an array' })
  @ArrayNotEmpty({ message: 'IDs array cannot be empty' })
  @IsMongoId({ each: true, message: 'Each ID must be a valid MongoDB ID' })
  ids: string[];
}
