import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithFilter } from 'src/common/dto/filter/with-filter.args.dto';
import { WithOrder } from 'src/common/dto/order/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { AssignmentFilterMap } from './assignment-filter-map.input.dto';
import { AssignmentOrderMap } from './assignment-order-map.input.dto';

@ArgsType()
export class QueryAssignmentsArgs extends IntersectionType(
  WithPagination,
  IntersectionType(
    WithOrder.for(() => AssignmentOrderMap),
    WithFilter.for(() => AssignmentFilterMap),
  ),
) {
  @Field(() => Boolean, { nullable: true })
  ownOnly?: boolean;
}
