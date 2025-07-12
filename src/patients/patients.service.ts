import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { PatientListDto } from './dto/patient-list.dto';
import { PatientQueryBuilder } from './utils/';

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
}
