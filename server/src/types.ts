import { Request, Response } from 'express';
import { User } from './entities/User';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Redis } from 'ioredis';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
  }
}

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
export class UserCredentials {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
