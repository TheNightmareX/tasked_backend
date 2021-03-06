import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { FilterMap } from 'src/common/dto/filter/filter-map.input.dto';
import { Context } from 'src/context/context.class';
import { Role } from 'src/memberships/entities/role.enum';
import { MikroQuotaService } from 'src/mikro/mikro-quota/mikro-quota.service';
import { Repository } from 'src/mikro/repository.class';

import { CreateRoomArgs } from './dto/create-room.args.dto';
import { DeleteRoomArgs } from './dto/delete-room.args.dto';
import { QueryRoomArgs } from './dto/query-room.args.dto';
import { QueryRoomsArgs } from './dto/query-rooms.args.dto';
import { UpdateRoomArgs } from './dto/update-room.args.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    private em: EntityManager,
    @InjectRepository(Room) private repo: Repository<Room>,
    private quota: MikroQuotaService,
  ) {}

  async queryMany(
    { limit, offset, order, filter, joinedOnly }: QueryRoomsArgs,
    query: FilterQuery<Room> = {},
  ) {
    const user = Context.current.user;
    return this.repo.findAndPaginate(
      {
        $and: [
          query,
          filter ? FilterMap.resolve(filter) : {},
          joinedOnly
            ? {
                memberships: {
                  owner: user,
                  deletedAt: null,
                },
              }
            : {},
        ],
      },
      {
        limit,
        offset,
        filters: [CommonFilter.Crud],
        orderBy: { ...order },
      },
    );
  }

  async queryOne({ id }: QueryRoomArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateRoomArgs) {
    const user = Context.current.user;
    await this.em.populate(user, ['rooms']);
    await this.quota.check(user, 'rooms');
    return this.repo.create({
      creator: user,
      memberships: [{ owner: user, role: Role.Manager }],
      isOpen: true,
      ...data,
    });
  }

  async updateOne({ id, data }: UpdateRoomArgs) {
    const room = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    const user = Context.current.user;
    if (user != room.creator)
      throw new ForbiddenException('Cannot update rooms not created by you');

    return room.assign(data);
  }

  async deleteOne({ id }: DeleteRoomArgs) {
    const room = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    const user = Context.current.user;
    if (user != room.creator)
      throw new ForbiddenException('Cannot delete rooms not created by you');

    await this.repo.populate(room, [
      'applications',
      'memberships',
      'memberships.assignments',
      'memberships.tasks',
    ]);

    return this.repo.delete(room);
  }
}
