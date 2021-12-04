import {
  ChangeSet,
  ChangeSetType,
  EventSubscriber,
  FlushEventArgs,
  Subscriber,
} from '@mikro-orm/core';

import { SoftDeletable } from './soft-deletable.decorator';
import { SOFT_DELETABLE } from './soft-deletable.symbol';
import { SoftDeletableMetadata } from './soft-deletable-metadata.interface';

/**
 * Intercept deletions of soft-deletable entities and perform updates instead.
 *
 * @see {SoftDeletable}
 * @see https://github.com/mikro-orm/mikro-orm/issues/1492#issuecomment-785394397
 */
@Subscriber()
export class SoftDeletableHandlerSubscriber implements EventSubscriber {
  async onFlush({ uow }: FlushEventArgs) {
    const deletionChangeSets = uow
      .getChangeSets()
      .filter((item) => item.type == ChangeSetType.DELETE);

    deletionChangeSets.forEach(
      <Entity, Field extends keyof Entity>(item: ChangeSet<Entity>) => {
        const metadata: SoftDeletableMetadata<Entity, Field> | undefined =
          Reflect.getMetadata(SOFT_DELETABLE, item.entity.constructor);
        if (metadata) {
          const { field, value } = metadata;
          item.type = ChangeSetType.UPDATE;
          item.entity[field] = value();
          item.payload[field] = value();
          uow.recomputeSingleChangeSet(item.entity);
        }
      },
    );
  }
}

SoftDeletable;
