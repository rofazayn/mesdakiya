import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: 'mesdakiya',
  user: 'rofazayn',
  type: 'postgresql',
  debug: !__prod__,
  entities: [Post],
} as Parameters<typeof MikroORM.init>[0];
