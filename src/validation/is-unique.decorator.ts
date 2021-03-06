import { FindOptions } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsUniqueConstraint } from './is-unique.constraint';

export const IsUnique =
  <Entity>(
    entityType: () => Type<Entity>,
    field: keyof Entity,
    filters?: FindOptions<never>['filters'],
    options?: ValidationOptions,
  ): PropertyDecorator =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [entityType, field, filters],
      target,
      options,
      propertyName,
      validator: IsUniqueConstraint,
    });
