import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthInfo } from 'src/auth/auth-info.interface';
import { AuthController, PREFIX } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ObtainTokenDto } from 'src/auth/dto/obtain-token.dto';
import { User } from 'src/users/entities/user.entity';
import { getRequester, insertUsers, urlBuilder } from 'test/utils';
import { getConnection, Repository } from 'typeorm';

const url = urlBuilder(`/${PREFIX}`);
describe(url(''), () => {
  let repository: Repository<User>;
  let app: INestApplication;
  let requester: ReturnType<typeof getRequester>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [getTypeOrmRootModule(true), AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get(getRepositoryToken(User));
    await insertUsers(repository, 2, AuthController.name);
    await app.init();
    requester = getRequester(app);
  });

  afterEach(async () => {
    await getConnection().close();
    await app.close();
  });

  describe('/ (POST)', () => {
    it('should return a token when passed correct data', async () => {
      const data: ObtainTokenDto = {
        username: 'username1',
        password: 'password1',
      };
      await requester
        .post(url('/'))
        .send(data)
        .expect(201)
        .expect(({ body }: { body: AuthInfo }) => {
          expect(body.token).toBeDefined();
          expect(isNaN(new Date(body.expiresAt).getTime())).toBe(false);
        });
    });

    it('should return a 401 when passed wrong data', async () => {
      const data: ObtainTokenDto = {
        username: 'username1',
        password: 'wrong',
      };
      await requester.post(url('/')).send(data).expect(401);
    });
  });
});
