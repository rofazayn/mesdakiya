import React from 'react';
import { Button, Box, Flex } from '@chakra-ui/react';
import { Container, Heading, Link, Text } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface Props {}

const Navbar: React.FC = ({}: Props) => {
  const [{ data, fetching }] = useMeQuery();

  let navbarBody = null;

  if (fetching) {
    navbarBody = null;
  } else if (!data?.me) {
    navbarBody = (
      <Box>
        <NextLink href='/login' passHref>
          <Link p={2}>Login</Link>
        </NextLink>
        <NextLink href='register' passHref>
          <Link p={2}>Register</Link>
        </NextLink>
      </Box>
    );
  } else {
    navbarBody = (
      <Box>
        <Flex alignItems='center'>
          <Text me={3} fontWeight='bold'>
            {data?.me.username}
          </Text>
          <Button>Logout</Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box py={4}>
      <Container maxW='container.lg'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Box>
            <Heading size='md'>Mesdakiya.</Heading>
          </Box>
          {navbarBody}
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
