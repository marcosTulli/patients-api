import { FilterQuery, SortOrder } from 'mongoose';
import { PatientFilterBuilder } from './patient-filter.builder';
import { PatientListDto, SortDirection } from '../dto';
import { Patient } from '../schema/patient.schema';

export class PatientQueryBuilder {
  static buildSort(sort: PatientListDto['sort']): Record<string, SortOrder> {
    if (sort?.field) {
      return {
        [sort.field]: sort.direction === SortDirection.DESC ? -1 : 1,
      };
    }
    return { _id: 1 };
  }

  static buildPagination(pagination: PatientListDto['pagination']): {
    skip: number;
    limit: number;
  } {
    const page = pagination?.page ?? 1;
    const take = pagination?.take ?? 10;

    const skip = (page - 1) * take;
    return { skip, limit: take };
  }

  static buildQuery(patientListDto: PatientListDto): {
    filter: FilterQuery<Patient>;
    sort: Record<string, SortOrder>;
    skip: number;
    limit: number;
  } {
    const filter = PatientFilterBuilder.buildFilter(patientListDto.filter);
    const sort = this.buildSort(patientListDto.sort);
    const { skip, limit } = this.buildPagination(patientListDto.pagination);

    return { filter, sort, skip, limit };
  }
}
