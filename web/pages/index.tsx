import { Container, Heading } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../src/generated/graphql';
import { createURQLCLient } from '../src/utils/createURQLClient';

const Home: NextPage = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Container maxW='container.sm'>
      <Heading py={3}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Welcome to Mesdakiya, where people choose what's authentic and what's
        not.
      </Heading>
      {!data
        ? 'Loading...'
        : data.posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </Container>
  );
};

export default withUrqlClient(createURQLCLient, { ssr: true })(Home);
