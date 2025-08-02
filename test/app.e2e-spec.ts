import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const logger = new Logger('AppE2ETest');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger.log('Test application initialized');
  });

  it('/ (GET) should return 404', () => {
    logger.log('Testing root endpoint');
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
      .then(() => logger.log('Root endpoint test passed'));
  });

  afterEach(async () => {
    await app.close();
    logger.log('Test application closed');
  });
});