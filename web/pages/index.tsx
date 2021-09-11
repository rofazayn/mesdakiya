import { Container, Heading, Text } from '@chakra-ui/layout';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <Container width='lg'>
      <Heading py={4}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Welcome to Mesdakiya, where people choose what's authentic and what's
        not.
      </Heading>
      <Text>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat culpa
        a, quas necessitatibus temporibus sed, enim illo dolorum vero, dolore
        quod esse praesentium? Illum quidem reprehenderit aperiam maiores
        consequuntur culpa tempora voluptatibus architecto quia tenetur quaerat
        repellat omnis explicabo molestiae consectetur optio, ex dolorum? A
        expedita ex iure ut, nulla eum, quibusdam error autem minus placeat
        ratione ea debitis repellat eos est! Quasi sit, consectetur, rem eius
        mollitia, sequi fugit dignissimos excepturi itaque illum facilis minima
        temporibus tempore alias dolores.
      </Text>
    </Container>
  );
};

export default Home;
