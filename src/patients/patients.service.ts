import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { PatientListDto, SortDirection } from './dto/patient-list.dto';

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
    const {
      pagination = { page: 1, take: 10 },
      filter = null,
      sort = null,
    } = patientListDto;

    const { page = 1, take = 10 } = pagination;
    const skip = (page - 1) * take;

    const query: FilterQuery<Patient> = {};
    if (filter) {
      if (filter.firstName) {
        query.firstName = { $regex: filter.firstName, $options: 'i' };
      }
      if (filter.lastName) {
        query.lastName = { $regex: filter.lastName, $options: 'i' };
      }
      if (filter.email) {
        query.email = { $regex: filter.email, $options: 'i' };
      }
      if (filter.phoneNumber) {
        query.phoneNumber = { $regex: filter.phoneNumber, $options: 'i' };
      }
      if (filter.dobFrom || filter.dobTo) {
        const dobFilter: Record<string, Date> = {};

        if (filter.dobFrom) {
          dobFilter.$gte = new Date(filter.dobFrom);
        }
        if (filter.dobTo) {
          dobFilter.$lte = new Date(filter.dobTo);
        }

        if (Object.keys(dobFilter).length > 0) {
          query.dob = dobFilter;
        }
      }
    }

    let sortObj: Record<string, SortOrder> = { _id: 1 };
    if (sort && sort.field) {
      sortObj = {
        [sort.field]: sort.direction === SortDirection.DESC ? -1 : 1,
      };
    }

    const total = await this.patientModel.countDocuments(query).exec();

    const patients = await this.patientModel
      .find(query)
      .skip(skip)
      .limit(take)
      .sort(sortObj)
      .exec();

    return { patients, total };
  }
}
