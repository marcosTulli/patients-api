import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteOnePatientDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'MongoDB ObjectId of the patient to delete',
  })
  @IsMongoId({ message: 'Invalid MongoDB ID' })
  id: string;
}
