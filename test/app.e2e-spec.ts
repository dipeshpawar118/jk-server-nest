import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtain auth token
    const response = await request(app.getHttpServer())
      .post('/auth/generate-token')
      .send({ name: 'Test Name', email: 'test@test.com' });
    authToken = response.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/google (GET)', () => {
    return request(app.getHttpServer()).get('/auth/google').expect(302); // Expecting a redirect to Google
  });

  it('/posts (GET)', async () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('/posts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Test Post', content: 'This is a test post.' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Post');
        expect(res.body.content).toBe('This is a test post.');
      });

    postId = response.body._id;
  });

  it('/posts/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Post');
        expect(res.body.content).toBe('This is a test post.');
      });
  });

  it('/posts (POST) without token', async () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Test Post', content: 'This is a test post.' })
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/posts/by-user (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/posts/by-user`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length > 1).toBeTruthy();
      });
  });

  it('/posts (GET) without token', async () => {
    return request(app.getHttpServer())
      .get('/posts/by-user')
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/posts/:id (PUT)', async () => {
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Test Post',
        content: 'This is an updated test post.',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Updated Test Post');
        expect(res.body.content).toBe('This is an updated test post.');
      });
  });

  it('/posts/:id (PUT) without token', async () => {
    return request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .send({
        title: 'Updated Test Post',
        content: 'This is an updated test post.',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/posts/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Post Deleted successfully');
      });
  });

  it('/posts/:id (DELETE) without token', async () => {
    return request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Unauthorized');
      });
  });
});
