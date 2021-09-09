import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Container } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React, { ReactElement } from 'react';
import InputField from '../components/InputField';

interface Props {}

function Register({}: Props): ReactElement {
  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => console.log(values)}
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
              Create account
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Register;
