import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schema/patient.schema';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { CreatePatientDto, PatientListDto } from './dto';
import { PatientQueryBuilder } from './utils';
import { MongoServerError } from 'mongodb';

@UseGuards(ApiKeyGuard)
@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findAllPaginated(
    patientListDto: PatientListDto,
  ): Promise<{ patients: Patient[]; total: number }> {
    const { filter, sort, skip, limit } =
      PatientQueryBuilder.buildQuery(patientListDto);
    const total = await this.patientModel.countDocuments(filter).exec();

    const patients = await this.patientModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return { patients, total };
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const patient = new this.patientModel(createPatientDto);
      return await patient.save();
    } catch (error) {
      const mongoError = error as MongoServerError;
      if (mongoError.code === 11000) {
        throw new BadRequestException('Patient with this email already exists');
      }
      throw new BadRequestException('Failed to create patient');
    }
  }
}
