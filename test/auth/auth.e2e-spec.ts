import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Logger } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  const logger = new Logger('AuthE2ETest');

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger.log('Test application initialized with in-memory MongoDB');
  });

  it('/auth/register (POST) should register a new user', async () => {
    logger.log('Testing /auth/register endpoint');
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' })
      .expect(201);

    expect(response.body).toEqual({
      status: true,
      data: { token: expect.any(String) },
    });
    logger.log('Register endpoint test passed');
  });

  it('/auth/register (POST) should fail for duplicate username', async () => {
    logger.log('Testing /auth/register with duplicate username');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' })
      .expect(400)
      .expect({
        status: false,
        data: { message: 'Username already exists', data: [] },
      });
    logger.log('Duplicate username test passed');
  });

  it('/auth/login (POST) should login a user', async () => {
    logger.log('Testing /auth/login endpoint');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'loginuser', password: 'password123' });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'password123' })
      .expect(200);

    expect(response.body).toEqual({
      status: true,
      data: { token: expect.any(String) },
    });
    logger.log('Login endpoint test passed');
  });

  it('/auth/login (POST) should fail for invalid credentials', async () => {
    logger.log('Testing /auth/login with invalid credentials');
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'wrongpassword' })
      .expect(400)
      .expect({
        status: false,
        data: { message: 'Invalid credentials', data: [] },
      });
    logger.log('Invalid credentials test passed');
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
    logger.log('Test application and MongoDB closed');
  });
});