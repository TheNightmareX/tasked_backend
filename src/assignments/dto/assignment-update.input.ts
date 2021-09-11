import { PartialType, PickType } from '@nestjs/mapped-types';

import { AssignmentCreateInput } from './assignment-create.input';

export class AssignmentUpdateInput extends PartialType(
  PickType(AssignmentCreateInput, ['_context', 'isPublic'] as const),
) {}
