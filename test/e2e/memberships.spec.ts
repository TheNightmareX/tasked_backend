import { EntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { User } from 'src/users/entities/user.entity';

import { GraphQLClient } from './utils/graphql-client.class';
import { prepareE2E } from './utils/prepare-e2e';

describe('Memberships', () => {
  let app: INestApplication;
  let module: TestingModule;
  let client: GraphQLClient;
  let em: EntityManager;

  beforeEach(async () => {
    ({ app, module, client } = await prepareE2E());
    em = module.get(EntityManager);
  });

  beforeEach(async () => {
    await em
      .persist(em.create(User, { username: 'username', password: 'password' }))
      .flush();

    const token = await module
      .get(AuthService)
      .obtainJwt('username', 'password');

    client.setToken(token);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('membership', () => {
    let result: Membership;

    beforeEach(async () => {
      await em.persist(create()).flush();
    });

    it('should return the data', async () => {
      await request(`(id: 1)`, `{ id, displayName, role }`);
      expect(result).toEqual({
        id: '1',
        displayName: null,
        role: 'Teacher',
      });
    });

    it('should return an error when unauthenticated', async () => {
      client.setToken();
      const promise = request(`(id: 1)`, `{ id }`);
      await expect(promise).rejects.toThrow('Unauthorized');
    });

    async function request(args: string, fields: string) {
      const content = await client.request(
        `query { membership${args} ${fields} }`,
      );
      result = content.membership;
    }
  });

  describe('memberships', () => {
    let result: PaginatedMemberships;

    it('should return the data', async () => {
      await em.persist([create()]).flush();
      await request(``, `{ id }`);
      expect(result).toEqual({ total: 1, results: [{ id: '1' }] });
    });

    it('should return the data when paginated', async () => {
      await em.persist([create(), create(), create()]).flush();
      await request(`(limit: 1, offset: 1)`, `{ id }`);
      expect(result.total).toBe(3);
      expect(result.results[0]).toEqual({ id: '2' });
    });

    it('should return an error when unauthenticated', async () => {
      client.setToken();
      const promise = request(``, `{ id }`);
      await expect(promise).rejects.toThrow('Unauthorized');
    });

    async function request(args: string, fields: string) {
      const content = await client.request(
        `query { memberships${args} { total, results ${fields} } }`,
      );
      result = content.memberships;
    }
  });

  describe('deleteMembership', () => {
    let result: Membership;

    it('should delete and return the entity', async () => {
      await em.persist(create(2)).flush();
      await request(`(id: 1)`, `{ id }`);
      expect(result).toEqual({ id: '1' });
      expect(await em.count(Membership)).toBe(0);
    });

    it.each`
      data                                                         | error
      ${() => [create()]}                                          | ${'Cannot delete the membership of the creator'}
      ${() => [create(3, [[2, Role.Teacher], [1, Role.Student]])]} | ${'Cannot delete superior members'}
    `(
      'should return an error when unauthorized: $error',
      async ({ data, error }) => {
        await em.persist(data()).flush();
        const promise = request(`(id: 1)`, `{ id }`);
        await expect(promise).rejects.toThrow(error);
      },
    );

    async function request(args: string, fields: string) {
      const content = await client.request(
        `mutation { deleteMembership${args} ${fields} }`,
      );
      result = content.deleteMembership;
    }
  });

  function create(
    creator: unknown = 1,
    members: [unknown, Role][] = [[1, Role.Teacher]],
  ) {
    return em.create(Classroom, {
      name: 'name',
      creator,
      memberships: members.map(
        ([owner, role]) => ({ owner, role } as EntityData<Membership>),
      ),
    });
  }
});
