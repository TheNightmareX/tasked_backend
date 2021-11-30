import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ApplicationsService } from './applications.service';
import { AcceptApplicationArgs } from './dto/accept-application.args';
import { AcceptApplicationResult } from './dto/accept-application-result.dto';
import { CreateApplicationArgs } from './dto/create-application.args';
import { DeleteApplicationArgs } from './dto/delete-application.args';
import { PaginatedApplications } from './dto/paginated-applications.dto';
import { QueryApplicationArgs } from './dto/query-application.args';
import { QueryApplicationsArgs } from './dto/query-applications.args';
import { RejectApplicationArgs } from './dto/reject-application.args';
import { Application } from './entities/application.entity';

@Resolver(() => Application)
export class ApplicationsResolver {
  constructor(private service: ApplicationsService) {}

  @Query(() => PaginatedApplications)
  async applications(@Args() args: QueryApplicationsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Application)
  async application(@Args() args: QueryApplicationArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Application)
  async createApplication(@Args() args: CreateApplicationArgs) {
    return this.service.createOne(args);
  }

  @Mutation(() => Application)
  async rejectApplication(@Args() args: RejectApplicationArgs) {
    return this.service.rejectOne(args);
  }

  @Mutation(() => AcceptApplicationResult)
  async acceptApplication(@Args() args: AcceptApplicationArgs) {
    return this.service.acceptOne(args);
  }

  @Mutation(() => Application)
  async deleteApplication(@Args() args: DeleteApplicationArgs) {
    return this.service.deleteOne(args);
  }
}
