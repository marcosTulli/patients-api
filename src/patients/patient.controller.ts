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
  UseGuards,
} from '@nestjs/common';
import {
  CreatePatientDto,
  DeleteManyPatientsDto,
  PatientListDto,
  UpdatePatientDto,
} from './dto';
import { PatientsService } from './patient.service';
import { Patient } from './schema/patient.schema';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReadOnlyOperation,
  WriteOnlyOperation,
} from './decorators/patient-decorators';

@ApiTags('patients')
@ApiSecurity('ApiKeyAuth')
@Controller('patients')
@UseGuards(ApiKeyGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ReadOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({
    status: 200,
    description: 'List of patients',
    type: [Patient],
  })
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ReadOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single patient by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient found', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatient(@Param('id') id: string): Promise<Patient> {
    if (!id) {
      throw new BadRequestException('Patient id is required');
    }
    return this.patientsService.findOnePatientById(id);
  }

  @Post('list')
  @ReadOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get patients with pagination, filters, and sorting',
  })
  @ApiBody({ type: PatientListDto })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of patients',
    schema: {
      type: 'object',
      properties: {
        patients: { type: 'array', items: { $ref: getSchemaPath(Patient) } },
        total: { type: 'integer' },
      },
    },
  })
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
  @WriteOnlyOperation()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 201, description: 'Patient created', type: Patient })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    if (!createPatientDto) {
      throw new BadRequestException('Request body is required');
    }
    return this.patientsService.createPatient(createPatientDto);
  }

  @Patch(':id')
  @WriteOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a patient' })
  @ApiParam({ name: 'id', required: true, description: 'Patient ID' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Patient updated', type: Patient })
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  @WriteOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiParam({ name: 'id', required: true, description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient deleted',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
        name: { type: 'string', nullable: true },
      },
    },
  })
  async deleteOne(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean; name?: string }> {
    if (!id) {
      throw new BadRequestException('Patient id is required');
    }
    return this.patientsService.deleteOnePatient(id);
  }

  @Post('delete')
  @WriteOnlyOperation()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete multiple patients' })
  @ApiBody({ type: DeleteManyPatientsDto })
  @ApiResponse({
    status: 200,
    description: 'Patients deleted',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
        deletedNames: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
      },
    },
  })
  async deleteMany(
    @Body() dto: DeleteManyPatientsDto,
  ): Promise<{ deleted: boolean; deletedNames?: string[] }> {
    if (!dto?.ids || !dto.ids.length) {
      throw new BadRequestException('Array of patient IDs is required');
    }
    return this.patientsService.deleteManyPatients(dto);
  }
}
