import { IsMongoId } from 'class-validator';

export class DeleteOnePatientDto {
  @IsMongoId({ message: 'Invalid MongoDB ID' })
  id: string;
}
