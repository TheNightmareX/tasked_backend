import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Repository } from 'src/mikro/repository.class';

import { CreateUserArgs } from './dto/create-user.args';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async queryMany({ limit, offset }: QueryUsersArgs) {
    return this.repo.findAndPaginate(
      {},
      { limit, offset, filters: [CommonFilter.Crud] },
    );
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
