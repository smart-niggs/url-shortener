import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { configService } from 'src/common/config/config.service';

describe('AppController', () => {
  let app: INestApplication;
  const longUrl = `https://theallanaguirre.medium.com/the-worst-mtv-challenge-eliminations-ever-ones-where-everyone-lost-1968c4c92010`

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  it('/ (GET ) - should get API Index', (done) => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(`You have reached ${configService.getAppName().toUpperCase()} routes.`)
      .end(done);
  });


  describe('Add New URL', () => {
    let shortenedUrl;
    it('/ (POST ) - should add new url', async (done) => {
      const res = await request(app.getHttpServer())
        .post('/')
        .send({ long_url: longUrl })
      expect(res.status).toEqual(201);
      shortenedUrl = res.text;
      done();
    });

    it('/ (POST ) - should not add existing long url, but return the already shortned url', async (done) => {
      const res = await request(app.getHttpServer())
        .post('/')
        .send({ long_url: longUrl })
      expect(res.status).toEqual(201);
      expect(shortenedUrl).toEqual(res.text); // should be equal to previously existing url
      done();
    });
  });


  describe('Get All URLs', () => {
    it('/urls (GET ) - should get all Urls', async (done) => {
      const res = await request(app.getHttpServer()).get('/urls')
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      done();
    });
  });


  describe('Go To Shortend URL and Redirect', () => {
    let shortenedUrl;

    beforeAll(async (done) => {
      const res = await request(app.getHttpServer())
        .post('/')
        .send({ long_url: longUrl })
      shortenedUrl = res.text.slice(-7);
      expect(res.status).toEqual(201);
      done();
    });

    it('/ (GET ) - should go to shortend url and redirect', (done) => {
      return request(app.getHttpServer())
        .get(shortenedUrl)
        .expect(304)
        .redirects(1)
        .end(done);
    });
  });


  afterAll(async () => {
    await app.close();
  });
});
