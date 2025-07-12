import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      message: 'Welcome to the patients API',
      description:
        'This API will let you perform CRUD operations over a list of patients',
      notes:
        'Some routes may require authentication. Refer to the API documentation for more details.',
      version: '1.0.0',
      status: 'OK',
      endpoints: {
        auth: '/auth',
        patients: '/patients',
      },
    };
  }
}
