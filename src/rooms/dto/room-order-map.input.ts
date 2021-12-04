import { InputType } from '@nestjs/graphql';
import { OrderMap } from 'src/common/dto/order-map.input';

import { Room } from '../entities/room.entity';

@InputType()
export class RoomOrderMap extends OrderMap.for(
  () => Room,
  ['id', 'name', 'description', 'isOpen', 'createdAt', 'updatedAt'],
) {}
