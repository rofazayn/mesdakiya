import { Container, Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { ReactElement, useState } from 'react';
import InputField from '../src/components/InputField';
import { useForgotPasswordMutation } from '../src/generated/graphql';
import { createURQLCLient } from '../src/utils/createURQLClient';

interface ForgotPasswordPageProps {}

function ForgotPasswordPage({}: ForgotPasswordPageProps): ReactElement {
  const [isComplete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Container maxWidth='sm'>
      <Formik
        initialValues={{ email: '' }}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='email'
              type='email'
              label='Email'
              placeholder='Email linked to your account'
            />
            {!isComplete ? null : (
              <Box
                py={3}
                px={4}
                mb={3}
                bgColor='orange.50'
                color='orange.400'
                borderRadius='lg'
              >
                If that account exists, then we will send a password recovery
                email.
              </Box>
            )}
            <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Send recovery email
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default withUrqlClient(createURQLCLient, { ssr: false })(
  ForgotPasswordPage
);
