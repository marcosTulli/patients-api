import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PatientListDto } from './dto';
import { PatientsService } from './patient.service';
import { Patient } from './schema/patient.schema';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Post('list')
  async findAllPaginated(
    @Body() patientListDto: PatientListDto,
  ): Promise<{ patients: Patient[]; total: number }> {
    if (!patientListDto) {
      throw new BadRequestException(
        `Request body should be: {pagination: required, filter: optional, sort: optional}`,
      );
    }
    return this.patientsService.findAllPaginated(patientListDto);
  }
}
