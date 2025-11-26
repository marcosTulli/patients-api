import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesAllowed } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/users/schema/user.schema';

export const OperationType = {
  Read: 'read',
  Write: 'write',
} as const;

export type OperationType = (typeof OperationType)[keyof typeof OperationType];

export function ReadOnlyOperation() {
  return applyDecorators();
}

export function WriteOnlyOperation() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    RolesAllowed(Roles.Admin),
  );
}
