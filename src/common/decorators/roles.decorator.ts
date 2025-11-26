import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/users/schema/user.schema';

export const ROLES_KEY = 'roles';
export const RolesAllowed = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
