import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  // const myPost = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(myPost);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  const app = express();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server listening on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
