import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import { Container } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React, { ReactElement } from 'react';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import loginValidationSchema from '../validation/login';

interface LoginProps {}

function LoginPage({}: LoginProps): ReactElement {
  const router = useRouter();
  const [_, login] = useLoginMutation();
  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
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
            <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default LoginPage;
