import { ReturnTypeFunc } from '@nestjs/graphql';

export const Filterable =
  (type: ReturnTypeFunc): PropertyDecorator =>
  ({ constructor: target }, field: string) => {
    const map: FilterableFieldMap =
      Reflect.getOwnMetadata(FILTERABLE, target) ??
      new Map(Reflect.getMetadata(FILTERABLE, target));
    map.set(field, type);
    Reflect.defineMetadata(FILTERABLE, map, target);
  };

export const FILTERABLE = Symbol('filterable');

export type FilterableFieldMap = Map<string, ReturnTypeFunc>;
