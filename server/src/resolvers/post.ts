import { Post } from '../entities/Post';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string
  ): Promise<Post | undefined> {
    let post;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          title: title,
        })
        .returning('*')
        .execute();
      post = result.raw[0];
    } catch (err) {
      console.error('zbi', err);
    }
    console.log(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      post.title = title;
      await Post.update({ id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}
