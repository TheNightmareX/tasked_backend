import { InputType } from '@nestjs/graphql';
import { FilterMap } from 'src/common/dto/filter/filter-map.input.dto';

import { Room } from '../entities/room.entity';

@InputType()
export class RoomFilterMap extends FilterMap.from(Room) {}
