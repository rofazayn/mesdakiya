import argon2 from 'argon2';
import { sendForgottenPasswordEmail } from '../utils/sendEmail';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import {
  MyContext,
  UserCredentials,
  UsernamePasswordInput,
  UserResponse,
} from '../types';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '../utils/validateUserCredentials';

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
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { em, redis, req }: MyContext
  ) {
    // check if the token is valid
    const userId = await redis.get(`forgot_password-${token}`);
    if (!userId) {
      return {
        errors: [
          {
            field: 'global',
            message: 'your recovery token is expired',
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: parseInt(userId) });
    if (!user) {
      return {
        errors: [
          {
            field: 'global',
            message: 'user no longer exists',
          },
        ],
      };
    }

    const newHashedPassword = await argon2.hash(newPassword);
    user.password = newHashedPassword;
    await em.persistAndFlush(user);

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email: email });
    if (!user) {
      return true;
    }

    const token = v4();
    redis.set(`forgot_password-${token}`, user.id);
    const resetPasswordEmailHtml = `<a href='http://localhost:3000/change-password/${token}'>Click here</a> to reset your password.`;
    console.log(token);
    try {
      await sendForgottenPasswordEmail(email, resetPasswordEmailHtml);
    } catch (error) {
      return true;
    }

    return true;
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
