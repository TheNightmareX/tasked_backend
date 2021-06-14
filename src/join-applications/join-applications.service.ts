import { EntityData, NotFoundError } from '@mikro-orm/core';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory, RelationPath } from 'nest-mikro-crud';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';
import { ApplicationStatus } from './application-status.enum';
import { CreateJoinApplicationDto } from './dto/create-join-application.dto';
import { UpdateJoinApplicationDto } from './dto/update-join-application.dto';
import { JoinApplication } from './entities/join-application.entity';

@Injectable()
export class JoinApplicationsService extends new MikroCrudServiceFactory({
  entityClass: JoinApplication,
  dtoClasses: {
    create: CreateJoinApplicationDto,
    update: UpdateJoinApplicationDto,
  },
}).product {
  @Inject() membershipsService: MembershipsService;

  async create({
    data,
    user,
  }: {
    data: CreateJoinApplicationDto | EntityData<JoinApplication>;
    user: User;
  }) {
    const { classroom } = data;

    // forbid to create applications when there is already a pending application
    try {
      await this.retrieve({
        conditions: {
          owner: user,
          classroom,
          status: ApplicationStatus.Pending,
        },
        user,
      });
      throw new ForbiddenException();
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
    }

    // forbid to create applications if the user is already a member
    try {
      await this.membershipsService.retrieve({
        conditions: { owner: user, classroom },
        user,
      });
      throw new ForbiddenException();
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
    }

    return await super.create({
      data: {
        ...data,
        owner: user,
        status: ApplicationStatus.Pending,
      },
      user,
    });
  }

  async update({
    data,
    entity: application,
    user,
  }: {
    data: UpdateJoinApplicationDto;
    entity: JoinApplication;
    user: User;
  }) {
    await this.repository.populate(application, [
      'classroom',
    ] as RelationPath<JoinApplication>[]);
    // forbid anyone except the classroom's creator to manage the application
    if (user != application.classroom.creator) throw new ForbiddenException();

    // forbid to update a rejected application
    if (application.status == ApplicationStatus.Rejected)
      throw new ForbiddenException();

    application = await super.update({ data, entity: application, user });

    if (data.status == ApplicationStatus.Accepted) {
      const { classroom, role, owner } = application;
      await this.membershipsService.create({
        data: { classroom, role },
        user: owner,
      });
    }

    return application;
  }
}
