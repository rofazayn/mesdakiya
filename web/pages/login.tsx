import { Button } from '@chakra-ui/button';
import { Box, Container, Flex, Link } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../src/components/InputField';
import { useLoginMutation } from '../src/generated/graphql';
import { createURQLCLient } from '../src/utils/createURQLClient';
import { toErrorMap } from '../src/utils/toErrorMap';
import loginValidationSchema from '../src/validation/login';

interface LoginProps {}

const LoginPage = ({}: LoginProps) => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState('');
  const [_, login] = useLoginMutation();
  return (
    <Container maxWidth='sm'>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            if (response.data.login.errors[0].field === 'global') {
              setGlobalError(response.data.login.errors[0].message);
            }
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              label='Username'
              placeholder='Username'
            />
            <InputField
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
            />
            {!globalError ? null : (
              <Box
                py={3}
                px={4}
                mb={3}
                bgColor='red.50'
                color='red.500'
                borderRadius='lg'
              >
                {globalError}
              </Box>
            )}

            <Flex alignItems='center' justifyContent='space-between'>
              <Button type='submit' me={4} isLoading={isSubmitting}>
                Login
              </Button>
              <NextLink href='/forgot-password'>
                <Link>Forgot password?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createURQLCLient, { ssr: false })(LoginPage);
