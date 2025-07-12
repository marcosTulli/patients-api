import { FilterQuery } from 'mongoose';
import { Patient } from '../schema/patient.schema';
import { PatientListDto } from '../dto';

export class PatientFilterBuilder {
  static buildFilter(filter: PatientListDto['filter']): FilterQuery<Patient> {
    const query: FilterQuery<Patient> = {};

    if (!filter) {
      return query;
    }

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
      if (filter.dobFrom) dobFilter.$gte = new Date(filter.dobFrom);
      if (filter.dobTo) dobFilter.$lte = new Date(filter.dobTo);

      if (Object.keys(dobFilter).length) {
        query.dob = dobFilter;
      }
    }

    return query;
  }
}
