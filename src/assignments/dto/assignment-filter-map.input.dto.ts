import { InputType } from '@nestjs/graphql';
import { FilterMap } from 'src/common/dto/filter/filter-map.input.dto';

import { Assignment } from '../entities/assignment.entity';

@InputType()
export class AssignmentFilterMap extends FilterMap.from(Assignment) {}
