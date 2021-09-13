import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import { Container } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React, { ReactElement } from 'react';
import InputField from '../src/components/InputField';
import { useRegisterMutation } from '../src/generated/graphql';
import { toErrorMap } from '../src/utils/toErrorMap';
import registerValidationSchema from '../src/validation/register';

interface RegisterPageProps {}

function RegisterPage({}: RegisterPageProps): ReactElement {
  const router = useRouter();
  const [_, register] = useRegisterMutation();
  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={registerValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
              Create account
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default RegisterPage;
