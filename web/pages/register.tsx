import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import { Box, Container } from '@chakra-ui/layout';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { ReactElement, useState } from 'react';
import InputField from '../src/components/InputField';
import { useRegisterMutation } from '../src/generated/graphql';
import { toErrorMap } from '../src/utils/toErrorMap';
import registerValidationSchema from '../src/validation/register';
import { withUrqlClient } from 'next-urql';
import { createURQLCLient } from '../src/utils/createURQLClient';

interface RegisterPageProps {}

const RegisterPage = ({}: RegisterPageProps) => {
  const router = useRouter();
  const [globalError, setGlobalError] = useState('');
  const [_, register] = useRegisterMutation();
  return (
    <Container>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={registerValidationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            if (response.data.register.errors[0].field === 'global') {
              setGlobalError(response.data.register.errors[0].message);
            }
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
            <InputField name='email' label='Email' placeholder='Email' />
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
            <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Create account
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createURQLCLient, { ssr: false })(RegisterPage);
