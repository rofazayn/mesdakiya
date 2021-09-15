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
  Query,
  Resolver,
} from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '../utils/validateUserCredentials';

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
class UserCredentials {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserCredentials,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    // validate inputs
    try {
      await registerValidationSchema.validate(options);
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
      email: options.email,
      password: hashedPassword,
    });

    // duplicate username check
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: [
            { field: 'global', message: 'username or email already in use' },
          ],
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
    // validate inputs
    try {
      await loginValidationSchema.validate(options);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          errors: [{ field: error.path as string, message: error.message }],
        };
      } else {
        throw error;
      }
    }

    let user = null;
    if (options.username.includes('@')) {
      user = await em.findOne(User, { email: options.username });
    } else {
      user = await em.findOne(User, { username: options.username });
    }

    if (!user) {
      return {
        errors: [{ field: 'global', message: 'incorrect login credentials' }],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'global',
            message: 'incorrect login credentials',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
