import { FindOneOptions } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

export const IsPrimaryKey =
  <Entity>(
    entityType: () => Type<Entity>,
    filters?: FindOneOptions<never>['filters'],
    options?: ValidationOptions,
  ): PropertyDecorator =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [entityType, filters],
      options,
      target,
      propertyName,
      validator: IsPrimaryKeyConstraint,
    });
