import { InputType } from '@nestjs/graphql';
import { FilterMap } from 'src/common/dto/filter/filter-map.input.dto';

import { Application } from '../entities/application.entity';

@InputType()
export class ApplicationFilterMap extends FilterMap.from(Application) {}
