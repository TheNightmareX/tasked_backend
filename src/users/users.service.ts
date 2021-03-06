import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { FilterMap } from 'src/common/dto/filter/filter-map.input.dto';
import { Context } from 'src/context/context.class';
import { Repository } from 'src/mikro/repository.class';

import { CreateUserArgs } from './dto/create-user.args.dto';
import { QueryUserArgs } from './dto/query-user.args.dto';
import { QueryUsersArgs } from './dto/query-users.args.dto';
import { UpdateUserArgs } from './dto/update-user.args.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async queryMany({ limit, offset, order, filter }: QueryUsersArgs) {
    return this.repo.findAndPaginate(filter ? FilterMap.resolve(filter) : {}, {
      limit,
      offset,
      filters: [CommonFilter.Crud],
      orderBy: { ...order },
    });
  }

  async queryOne({ id }: QueryUserArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateUserArgs) {
    return this.repo.create(data);
  }

  async updateOne({ id, data }: UpdateUserArgs) {
    const entity = await this.repo.findOneOrFail(id);

    const user = Context.current.user;
    if (entity != user)
      throw new ForbiddenException('Cannot update other users');

    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again recently');

    return entity.assign(data);
  }
}
