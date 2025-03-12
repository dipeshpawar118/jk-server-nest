// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class PostsService {
  private readonly logger = new CustomLogger();

  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // Get all posts - Public
  async getAll(): Promise<Post[]> {
    this.logger.log('Fetching all posts');
    return this.postModel.find().exec();
  }

  // Get post details by ID - Public
  async getDetails(id: string): Promise<Post | null> {
    this.logger.log(`Fetching details for post ID: ${id}`);
    return this.postModel.findById(id).exec();
  }

  // Get post details by userId - Protected
  async getPostByUserId(id: string): Promise<Post[]> {
    this.logger.log(`Fetching posts for user ID: ${id}`);
    return this.postModel.find({ userId: id }).exec();
  }

  // Create a new post - Protected
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    this.logger.log(`Creating a new post for user ID: ${userId}`);
    const createdPost = new this.postModel({
      ...createPostDto,
      userId,
    });
    return await createdPost.save();
  }

  // Update a post - Protected
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    this.logger.log(`Updating post ID: ${id} for user ID: ${userId}`);
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    if (post.userId !== userId) {
      throw new Error('You can only update your own posts');
    }
    post.title = updatePostDto.title || post.title;
    post.content = updatePostDto.content || post.content;
    post.updatedAt = new Date();
    return post.save();
  }

  // Delete a post - Protected
  async delete(id: string, userId: string): Promise<any> {
    this.logger.log(`Deleting post ID: ${id} for user ID: ${userId}`);
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.userId !== userId) {
        throw new Error('You can only delete your own posts');
      }
      await this.postModel.deleteOne({ _id: id }).exec();
      return { message: 'Post Deleted successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
