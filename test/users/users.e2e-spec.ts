import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateUserDto } from 'src/domain/resources/users/dto/create-user.dto';
import { UsersModule } from 'src/domain/resources/users/users.module';
import { User } from 'src/domain/resources/users/user.model';

describe('E2E Users module testing', () => {
  let app: INestApplication;
  let createdUser: User;

  // User mock
  const user = {
    firstname: 'Marie',
    lastname: 'Simone',
    email: 'marie.simone@biblio.com',
    password: 'megapassword',
  };

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    // Bootstrap app
    app = appModule.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('Create [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        createdUser = body;
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(body).toEqual(
          expect.objectContaining({
            firstname: 'Marie',
            lastname: 'Simone',
            email: 'marie.simone@biblio.com',
          }),
        );
      });
  });

  it('Update [PATCH /users/:id]', () => {
    return request(app.getHttpServer())
      .patch(`/users/${createdUser.id}`)
      .send({ email: 'marie.simone@gmail.com' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toHaveProperty('updatedAt');
        expect(body).toEqual(
          expect.objectContaining({
            id: createdUser.id,
            firstname: 'Marie',
            lastname: 'Simone',
            email: 'marie.simone@gmail.com',
          }),
        );
      });
  });

  it('List [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual([
          expect.objectContaining({
            firstname: 'Marie',
            lastname: 'Simone',
            email: 'marie.simone@gmail.com',
            company: null,
            role: null,
          }),
        ]);
      });
  });

  it('Get [GET /users/:id]', () => {
    return request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual({
          id: createdUser.id,
          firstname: 'Marie',
          lastname: 'Simone',
          email: 'marie.simone@gmail.com',
          company: null,
          role: null,
        });
      });
  });

  it('Delete [DELETE /users/:id]', () => {
    return request(app.getHttpServer())
      .delete(`/users/${createdUser.id}`)
      .send({ email: 'marie.simone@gmail.com' })
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual({
          firstname: 'Marie',
          lastname: 'Simone',
          email: 'marie.simone@gmail.com',
        });
      });
  });

  afterAll(async () => {
    // Close DB connection so that Jest can exit
    await app.close();
  });
});
