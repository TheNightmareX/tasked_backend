import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipRefLoader extends EntityRefLoader<Membership> {
  @InjectRepository(Membership) protected repo: Repository<Membership>;
}
