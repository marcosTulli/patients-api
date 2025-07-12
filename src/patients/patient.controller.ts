import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreatePatientDto,
  DeleteManyPatientsDto,
  PatientListDto,
  UpdatePatientDto,
} from './dto';
import { PatientsService } from './patient.service';
import { Patient } from './schema/patient.schema';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPatient(@Param('id') id: string): Promise<Patient> {
    if (!id) {
      throw new BadRequestException('Patient id is required');
    }
    return this.patientsService.findOnePatientById(id);
  }

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async findAllPaginated(
    @Body() patientListDto: PatientListDto,
  ): Promise<{ patients: Patient[]; total: number }> {
    if (!patientListDto) {
      throw new BadRequestException(
        'Request body should be: {pagination: required, filter: optional, sort: optional}',
      );
    }
    return this.patientsService.findAllPaginated(patientListDto);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    if (!createPatientDto) {
      throw new BadRequestException('Request body is required');
    }
    return this.patientsService.createPatient(createPatientDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.updatePatient(id, updatePatientDto);
  }
  j;

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean; name?: string }> {
    if (!id) {
      throw new BadRequestException('Patient id is required');
    }
    return this.patientsService.deleteOnePatient(id);
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async deleteMany(
    @Body() dto: DeleteManyPatientsDto,
  ): Promise<{ deleted: boolean; deletedNames?: string[] }> {
    if (!dto?.ids || !dto.ids.length) {
      throw new BadRequestException('Array of patient IDs is required');
    }
    return this.patientsService.deleteManyPatients(dto);
  }
}
