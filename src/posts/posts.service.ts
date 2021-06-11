import { Post } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type ShowUserPostsRequest = {
  authorId: string;
};

type CreateRequest = {
  authorId: string;
  title: string;
  content: string;
};

type UpdateRequest = {
  id: string;
  title: string;
  content: string;
};

type DeleteRequest = {
  id: string;
};

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async showUserPosts({ authorId }: ShowUserPostsRequest): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({ where: { authorId } });
    return posts;
  }

  async createPost({ authorId, title, content }: CreateRequest): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        authorId,
        title,
        content,
      },
    });

    return post;
  }

  async updatePost({ id, title, content }: UpdateRequest): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new HttpException(
        'This post does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return updatedPost;
  }

  async deletePost({ id }: DeleteRequest): Promise<void> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new HttpException(
        'This post does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
