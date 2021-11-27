import { AnyEntity, EntityManager, FilterQuery, wrap } from '@mikro-orm/core';
import { OperatorMap } from '@mikro-orm/core/dist/typings';
import DataLoader from 'dataloader';

export class MikroRefLoaderDataLoader<
  Entity extends AnyEntity<Entity>,
> extends DataLoader<Entity, Entity> {
  constructor(em: EntityManager) {
    super(async (refs) => {
      const meta = wrap(refs[0], true).__meta;
      const primary = meta.primaryKeys[0];
      const keys = refs.map((ref) => ref[primary]);
      const entities: Entity[] = await em.find(meta.name, {
        [primary]: { $in: keys } as OperatorMap<never>,
      } as FilterQuery<Entity>);
      const results = keys.map((key) =>
        entities.find((entity) => entity[primary] == key),
      );
      return results;
    });
  }
}
