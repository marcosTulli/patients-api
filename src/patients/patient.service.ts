import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schema/patient.schema';
import {
  CreatePatientDto,
  DeleteManyPatientsDto,
  PatientListDto,
  UpdatePatientDto,
} from './dto';
import { PatientQueryBuilder } from './utils';
import { MongoServerError } from 'mongodb';

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

  async findOnePatientById(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new BadRequestException(`Patient with id ${id} not found`);
    }
    return patient;
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const patient = new this.patientModel({
        ...createPatientDto,
        createdAt: new Date(),
      });
      return await patient.save();
    } catch (error) {
      const mongoError = error as MongoServerError;
      if (mongoError.code === 11000) {
        throw new BadRequestException('Patient with this email already exists');
      }
      throw new BadRequestException('Failed to create patient');
    }
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedPatient) {
        throw new BadRequestException(`Patient with id ${id} not found`);
      }

      return updatedPatient;
    } catch (error) {
      const mongoError = error as MongoServerError;
      if (mongoError.code === 11000) {
        throw new BadRequestException('Patient with this email already exists');
      }
      throw new BadRequestException('Failed to update patient');
    }
  }

  async deleteOnePatient(
    id: string,
  ): Promise<{ deleted: boolean; name?: string }> {
    const patient = await this.patientModel.findById(id).exec();

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    await this.patientModel.deleteOne({ _id: id });
    return {
      deleted: true,
      name: `${patient.firstName} ${patient.lastName}`,
    };
  }

  async deleteManyPatients(
    dto: DeleteManyPatientsDto,
  ): Promise<{ deleted: boolean; users: string[] }> {
    const patients = await this.patientModel
      .find({ _id: { $in: dto.ids } })
      .select('firstName lastName')
      .exec();

    if (!patients.length) {
      return { deleted: false, users: [] };
    }

    const users = patients.map((p) =>
      `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
    );

    await this.patientModel.deleteMany({ _id: { $in: dto.ids } }).exec();

    return { deleted: true, users };
  }
}
