import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClientError, GraphQLClient } from 'graphql-request';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { TOKEN_LENGTH } from 'src/constants';
import { User } from 'src/users/entities/user.entity';
import { prepareE2E } from 'test/utils';

describe('Auth', () => {
  let app: INestApplication;
  let module: TestingModule;
  let client: GraphQLClient;
  let repository: EntityRepository<User>;

  beforeEach(async () => {
    ({ app, module, client } = await prepareE2E());
    repository = module.get<EntityRepository<User>>(getRepositoryToken(User));

    repository.persist(
      repository.create({
        username: 'username1',
        password: 'password1',
      }),
    );
    await repository.flush();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('obtainToken', () => {
    let token: string;

    it('should return the token with legal arguments', async () => {
      await request(`(username: "username1", password: "password1")`);
      expect(token).toHaveLength(TOKEN_LENGTH);
    });

    it.each`
      desc             | args
      ${'wrong value'} | ${'(username: "", password: "")'}
      ${'wrong type'}  | ${'(username: 1, password: 1)'}
      ${'no args'}     | ${''}
    `('should throws an error with illegal arguments: $desc', async (args) => {
      await expect(request(args)).rejects.toThrowError(ClientError);
    });

    async function request(args: string) {
      const result = await client.request<{ obtainToken: AuthResult }>(
        `mutation { obtainToken${args} { token } }`,
      );
      token = result.obtainToken.token;
    }
  });
});