import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePostDTO } from './create-post-DTO';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { id } = request.user;

    const posts = await this.postsService.showUserPosts({ authorId: id });

    return response.json(posts);
  }

  @Post()
  async create(
    @Body() { title, content }: CreatePostDTO,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { id } = request.user;

    const post = await this.postsService.createPost({
      authorId: id,
      title,
      content,
    });

    return response.json(post);
  }

  @Put('/:id')
  async update(
    @Body() { title, content }: CreatePostDTO,
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const updatedPost = await this.postsService.updatePost({
      id,
      title,
      content,
    });

    return response.json(updatedPost);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    await this.postsService.deletePost({ id });

    return response.json();
  }
}
