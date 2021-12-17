import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentRefLoader extends RefLoader<Assignment> {
  constructor(
    @InjectRepository(Assignment) protected repo: Repository<Assignment>,
  ) {
    super();
  }
}
