import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            getDetails: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getPostByUserId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of posts', async () => {
      const result = [];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      const response = await controller.getAll();
      expect(response).toBe(result);
      expect(Array.isArray(response)).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test',
        content: 'Test content',
      };
      const req = { user: { userId: '1' } };
      const result: any = { _id: '1', ...createPostDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createPostDto, req)).toBe(result);
    });
  });

  describe('getDetails', () => {
    it('should return post details', async () => {
      const result: any = { id: '1', title: 'Test', content: 'Test content' };
      jest.spyOn(service, 'getDetails').mockResolvedValue(result);

      expect(await controller.getDetails('1')).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const req = { user: { userId: '1' } };
      const result: any = { deleted: true };
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.delete('1', req)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Test',
        content: 'Updated content',
      };
      const req = { user: { userId: '1' } };
      const result: any = { id: '1', ...updatePostDto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updatePostDto, req)).toBe(result);
    });
  });
});
