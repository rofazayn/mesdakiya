import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      // store: new RedisStore({ client: redisClient, disableTouch: true }),
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      saveUninitialized: false,
      secret: 'eqwfrgwfesdfvr3gr',
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years in ms
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
    })
  );

  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // initialize server
  app.listen(4000, () => {
    console.log('server listening on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
