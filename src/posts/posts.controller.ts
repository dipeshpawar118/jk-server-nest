// src/posts/posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Public: Get all posts
  @Get()
  async getAll() {
    return this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getPostByUser(@Request() req) {
    return this.postsService.getPostByUserId(req.user.userId);
  }

  // Public: Get post details by ID
  @Get(':id')
  async getDetails(@Param('id') id: string) {
    return this.postsService.getDetails(id);
  }

  // Protected: Create a post
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  // Protected: Update a post
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  // Protected: Delete a post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.postsService.delete(id, req.user.userId);
  }
}
