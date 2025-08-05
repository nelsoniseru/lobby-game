import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Logger } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('GameController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let token: string;
  let configService: ConfigService;
  const logger = new Logger('GameE2ETest');

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
    configService = moduleFixture.get<ConfigService>(ConfigService);
    await app.init();
    logger.log('Test application initialized with in-memory MongoDB');

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'gameuser', password: 'password123' });
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'gameuser', password: 'password123' });
    token = loginResponse.body.data.token;
    logger.log('Test user registered and logged in');
  });

  it('/game/start (POST) should fail without JWT token', async () => {
    logger.log('Testing /game/start without JWT token');
    await request(app.getHttpServer())
      .post('/game/start')
      .expect(401);
    logger.log('Unauthorized access test for /game/start passed');
  });

  it('/game/start (POST) should fail with invalid JWT token', async () => {
    logger.log('Testing /game/start with invalid JWT token');
    await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer invalid-token`)
      .expect(401);
    logger.log('Invalid token test for /game/start passed');
  });

  it('/game/start (POST) should start a new session', async () => {
    logger.log('Testing /game/start endpoint');
    const response = await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body).toEqual({
      status: true,
      data: {
        session: {
          sessionId: expect.any(String),
          creatorId: expect.any(String),
          players: [{ userId: expect.any(String), number: null }],
          status: 'active',
          startTime: expect.any(String),
          duration: configService.get<number>('SESSION_DURATION_SECONDS')! * 1000,
          id: expect.any(String),
        },
      },
    });
    logger.log('Start session test passed');
  });

  it('/game/start (POST) should fail if user is in active session', async () => {
    logger.log('Testing /game/start with active session');
    await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect({
        status: false,
        data: { message: 'User already in an active session', data: [] },
      });
    logger.log('Active session check test passed');
  });

  it('/game/join (POST) should fail without JWT token', async () => {
    logger.log('Testing /game/join without JWT token');
    await request(app.getHttpServer())
      .post('/game/join')
      .send({ sessionId: 'some-id', number: 5 })
      .expect(401);
    logger.log('Unauthorized access test for /game/join passed');
  });

  it('/game/join (POST) should fail with invalid JWT token', async () => {
    logger.log('Testing /game/join with invalid JWT token');
    await request(app.getHttpServer())
      .post('/game/join')
      .set('Authorization', `Bearer invalid-token`)
      .send({ sessionId: 'some-id', number: 5 })
      .expect(401);
    logger.log('Invalid token test for /game/join passed');
  });

  it('/game/join (POST) should join an active session', async () => {
    logger.log('Testing /game/join endpoint');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'newuser', password: 'password123' });
    const newUserResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'newuser', password: 'password123' });
    const newToken = newUserResponse.body.data.token;

    const sessionResponse = await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${newToken}`)
      .expect(201);
    const sessionId = sessionResponse.body.data.session.sessionId;

    const response = await request(app.getHttpServer())
      .post('/game/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId, number: 5 })
      .expect(200);

    expect(response.body).toEqual({
      status: true,
      data: {
        session: {
          sessionId,
          creatorId: expect.any(String),
          players: [
            { userId: expect.any(String), number: null },
            { userId: expect.any(String), number: 5 },
          ],
          status: 'active',
          startTime: expect.any(String),
          duration: expect.any(Number),
          id: expect.any(String),
        },
      },
    });
    logger.log('Join session test passed');
  });

  it('/game/join (POST) should fail for invalid session', async () => {
    logger.log('Testing /game/join with invalid session');
    await request(app.getHttpServer())
      .post('/game/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'invalid', number: 5 })
      .expect(400)
      .expect({
        status: false,
        data: { message: 'Session not active', data: [] },
      });
    logger.log('Invalid session join test passed');
  });

  it('/game/join (POST) should add user to queue if session is full', async () => {
    logger.log('Testing /game/join with full session');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'queueuser', password: 'password123' });
    const queueUserResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'queueuser', password: 'password123' });
    const queueToken = queueUserResponse.body.data.token;

    const sessionResponse = await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${queueToken}`)
      .expect(201);
    const sessionId = sessionResponse.body.data.session.sessionId;

    for (let i = 1; i < configService.get<number>('SESSION_USER_CAP')!; i++) {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: `user${i}`, password: 'password123' });
      const userResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: `user${i}`, password: 'password123' });
      const userToken = userResponse.body.data.token;

      await request(app.getHttpServer())
        .post('/game/join')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ sessionId, number: i });
    }

    const response = await request(app.getHttpServer())
      .post('/game/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId, number: 5 })
      .expect(200);

    expect(response.body).toEqual({
      status: false,
      data: { message: 'Session full, added to queue', data: [] },
    });
    logger.log('Session full queue test passed');
  });

  it('/game/leave (POST) should fail without JWT token', async () => {
    logger.log('Testing /game/leave without JWT token');
    await request(app.getHttpServer())
      .post('/game/leave')
      .send({ sessionId: 'some-id' })
      .expect(401);
    logger.log('Unauthorized access test for /game/leave passed');
  });

  it('/game/leave (POST) should fail with invalid JWT token', async () => {
    logger.log('Testing /game/leave with invalid JWT token');
    await request(app.getHttpServer())
      .post('/game/leave')
      .set('Authorization', `Bearer invalid-token`)
      .send({ sessionId: 'some-id' })
      .expect(401);
    logger.log('Invalid token test for /game/leave passed');
  });

  it('/game/leave (POST) should leave an active session', async () => {
    logger.log('Testing /game/leave endpoint');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'leaveuser', password: 'password123' });
    const leaveUserResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'leaveuser', password: 'password123' });
    const leaveToken = leaveUserResponse.body.data.token;

    const sessionResponse = await request(app.getHttpServer())
      .post('/game/start')
      .set('Authorization', `Bearer ${leaveToken}`)
      .expect(201);
    const sessionId = sessionResponse.body.data.session.sessionId;

    await request(app.getHttpServer())
      .post('/game/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId, number: 5 });

    const response = await request(app.getHttpServer())
      .post('/game/leave')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId })
      .expect(200);

    expect(response.body.data.session.players).toHaveLength(1);
    logger.log('Leave session test passed');
  });

  it('/game/leave (POST) should fail for invalid session', async () => {
    logger.log('Testing /game/leave with invalid session');
    await request(app.getHttpServer())
      .post('/game/leave')
      .set('Authorization', `Bearer ${token}`)
      .send({ sessionId: 'invalid' })
      .expect(400)
      .expect({
        status: false,
        data: { message: 'Session not active', data: [] },
      });
    logger.log('Invalid session leave test passed');
  });

  it('/game/leaderboard (GET) should fail without JWT token', async () => {
    logger.log('Testing /game/leaderboard without JWT token');
    await request(app.getHttpServer())
      .get('/game/leaderboard')
      .expect(401);
    logger.log('Unauthorized access test for /game/leaderboard passed');
  });

  it('/game/leaderboard (GET) should fail with invalid JWT token', async () => {
    logger.log('Testing /game/leaderboard with invalid JWT token');
    await request(app.getHttpServer())
      .get('/game/leaderboard')
      .set('Authorization', `Bearer invalid-token`)
      .expect(401);
    logger.log('Invalid token test for /game/leaderboard passed');
  });

  it('/game/leaderboard (GET) should return top players', async () => {
    logger.log('Testing /game/leaderboard endpoint');
    const response = await request(app.getHttpServer())
      .get('/game/leaderboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      status: true,
      data: { topPlayers: expect.any(Array) },
    });
    logger.log('Leaderboard test passed');
  });

  it('/game/sessions-by-date (GET) should fail without JWT token', async () => {
    logger.log('Testing /game/sessions-by-date without JWT token');
    await request(app.getHttpServer())
      .get('/game/sessions-by-date')
      .expect(401);
    logger.log('Unauthorized access test for /game/sessions-by-date passed');
  });

  it('/game/sessions-by-date (GET) should fail with invalid JWT token', async () => {
    logger.log('Testing /game/sessions-by-date with invalid JWT token');
    await request(app.getHttpServer())
      .get('/game/sessions-by-date')
      .set('Authorization', `Bearer invalid-token`)
      .expect(401);
    logger.log('Invalid token test for /game/sessions-by-date passed');
  });

  it('/game/sessions-by-date (GET) should return sessions grouped by date', async () => {
    logger.log('Testing /game/sessions-by-date endpoint');
    const response = await request(app.getHttpServer())
      .get('/game/sessions-by-date')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      status: true,
      data: { sessions: expect.any(Array) },
    });
    logger.log('Sessions by date test passed');
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
    logger.log('Test application and MongoDB closed');
  });
});