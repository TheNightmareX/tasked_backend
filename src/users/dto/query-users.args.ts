import { ArgsType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args';

@ArgsType()
export class QueryUsersArgs extends WithPagination {}
