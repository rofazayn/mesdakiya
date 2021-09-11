import argon2 from 'argon2';
import { User } from '../entities/User';
import { MyContext } from '../types';
import * as yup from 'yup';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';

@ObjectType()
class UserResponse {
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
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const registerValidationSchema = yup.object().shape({
      username: yup.string().required().min(4).max(20),
      password: yup.string().required().min(6).max(40),
    });

    // validate inputs
    try {
      await registerValidationSchema.validate(options).then();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          errors: [{ field: error.path as string, message: error.message }],
        };
      } else {
        throw error;
      }
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    // duplicate username check
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if ((error.code = '23505')) {
        return {
          errors: [{ field: 'username', message: 'username already in use.' }],
        };
      }
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          { field: 'username', message: 'Incorrect login credentials.' },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect login credentials.',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
