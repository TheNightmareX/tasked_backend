import { AnyEntity, Collection } from '@mikro-orm/core';
import { Injectable, Type } from '@nestjs/common';

import { QUOTA } from './quota.symbol';

@Injectable()
export class QuotaService {
  /**
   * Check all *initialized* `Collection` fields defined its quota.
   * @param entity
   */
  async check(entity: AnyEntity) {
    const type = entity.constructor as Type<AnyEntity>;
    Object.entries(entity).forEach(([field, value]) => {
      const quota: number | undefined = Reflect.getMetadata(
        QUOTA,
        entity,
        field,
      );

      if (quota == undefined) return;

      const collection = value as Collection<AnyEntity>;
      if (!collection.isInitialized()) return;

      const count = collection.count();
      if (count >= quota)
        throw new Error(
          `[${type.name}.${field}]: Quota exceeded. (${count}/${quota})`,
        );
    });
  }
}
